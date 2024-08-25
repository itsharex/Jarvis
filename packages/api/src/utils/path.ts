import * as pathAPI from "@tauri-apps/api/path"
import { BaseDirectory } from "@tauri-apps/api/path"
import { minimatch } from "minimatch"
import type {
	FsPermissionScoped,
	OpenPermissionScoped,
	ShellPermissionScoped
} from "../permissions/schema"

export async function combinePathAndBaseDir(target: string, baseDir?: BaseDirectory) {
	if (!baseDir) return target
	switch (baseDir) {
		case BaseDirectory.Desktop:
			return await pathAPI.join(await pathAPI.desktopDir(), target)
		case BaseDirectory.Document:
			return await pathAPI.join(await pathAPI.documentDir(), target)
		case BaseDirectory.Download:
			return await pathAPI.join(await pathAPI.downloadDir(), target)
		case BaseDirectory.Home:
			return await pathAPI.join(await pathAPI.homeDir(), target)
		case BaseDirectory.AppData:
			return await pathAPI.join(await pathAPI.appDataDir(), target)
		default:
			break
	}
}

export const mapDirAliasToDirFn: Record<string, () => Promise<string>> = {
	$DESKTOP: pathAPI.desktopDir,
	$DOCUMENT: pathAPI.documentDir,
	$DOWNLOAD: pathAPI.downloadDir,
	$HOME: pathAPI.homeDir,
	$APPDATA: pathAPI.appDataDir
}

/**
 * @example
 * Translate $DESKTOP/* to /Users/username/Desktop/*
 * Translate $DOWNLOAD/** to /Users/username/Downloads/**
 * @param scope expected to be like $DESKTOP/*, $DOWNLOAD/**, $DOCUMENT/abc/*.txt
 */
export async function translateScopeToPath(scope: string): Promise<string> {
	for (const key of Object.keys(mapDirAliasToDirFn)) {
		if (scope.startsWith(key)) {
			const alias = key
			const pattern = scope.slice(key.length)
			const dirFn = mapDirAliasToDirFn[alias]
			if (!dirFn) {
				throw new Error(`Invalid scope alias: ${alias}`)
			}
			const fullDir = await dirFn()
			return pathAPI.join(fullDir, pattern)
		}
	}
	throw new Error(`Invalid scope: ${scope}`)
}

/**
 * Target should be full path
 * TODO: but this function also does security check to prevent parent directory traversal
 * @param target full path to file
 * @param scope expected to be like $DESKTOP/*, $DOWNLOAD/**
 */
export async function matchPathAndScope(target: string, scope: string): Promise<boolean> {
	const translatedScope = await translateScopeToPath(scope)
	return minimatch(target, translatedScope)
}

/**
 * This is a helper function to verify scoped permission for path
 * If a scoped permission needs access to paths, this function verify whether the path is allowed by the permission
 * @param requiredPermissions
 * @param userPermissionScopes
 * @param path
 * @param options
 * @returns
 */
export async function verifyGeneralPathScopedPermission<T extends string[]>(
	requiredPermissions: T,
	userPermissionScopes: (FsPermissionScoped | OpenPermissionScoped | ShellPermissionScoped)[],
	path: string | URL,
	options?: { baseDir?: BaseDirectory }
) {
	path = path.toString()
	const fullPath = await combinePathAndBaseDir(path, options?.baseDir)
	if (!fullPath) {
		throw new Error("Invalid path or base directory")
	}
	const matchedPermissionScope = userPermissionScopes.filter((p) =>
		requiredPermissions.includes(p.permission)
	)
	if (matchedPermissionScope.length === 0) {
		throw new Error(
			`Path Permission denied. Require one of these: [${requiredPermissions.join(", ")}] for path: ${fullPath}`
		)
	}

	for (const permission of matchedPermissionScope) {
		// deny has priority, if deny rule is matched, we ignore allow rule
		for (const deny of permission.deny || []) {
			if (!deny.path) continue
			if (await matchPathAndScope(fullPath, deny.path)) {
				throw new Error(`Permission denied for path: ${fullPath} by rule ${deny.path}`)
			}
		}
		for (const allow of permission.allow || []) {
			if (!allow.path) continue
			if (await matchPathAndScope(fullPath, allow.path)) {
				return
			}
		}
	}
	// No Allow rule and path matched
	throw new Error(`Permission denied for path: ${path}, no rule matched.`)
}

/**
 * This permission verifier helps to verify scoped permission for URL or path
 * Pass in user scoped permission, value and key to verify, return true if permission is allowed
 * @param userPermissionScopes
 * @param value
 * @param key
 * @returns
 */
export async function verifyScopedPermission(
	userPermissionScopes: (FsPermissionScoped | OpenPermissionScoped | ShellPermissionScoped)[],
	value: string,
	key: "url" | "path"
): Promise<boolean> {
	async function match(value: string, scope: string): Promise<boolean> {
		if (key === "url") {
			return minimatch(value, scope)
		} else if (key === "path") {
			return matchPathAndScope(value, scope)
		} else {
			throw new Error(`Invalid key: ${key}`)
		}
	}
	let pass = false
	for (const permission of userPermissionScopes) {
		for (const allow of permission.allow || []) {
			if (allow[key] && (await match(value, allow[key]))) {
				pass = true
				break
			}
		}
		if (pass) {
			break
		}
		for (const deny of permission.deny || []) {
			if (deny[key] && (await match(value, deny[key]))) {
				pass = false
				break
			}
		}
	}
	return pass
}