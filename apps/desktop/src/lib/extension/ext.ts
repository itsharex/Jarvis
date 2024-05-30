import { z } from "zod";
import {
  ListItemType,
  TListItem,
  TListGroup,
  type ExtPackageJsonExtra,
  type InlineCmd,
  type UiCmd,
} from "jarvis-api";
import { type IExtensionBase } from "./base";
import { $appConfig } from "@/lib/stores/appConfig";
import { loadAllExtensions } from "@/lib/commands/manifest";
import { pathExists } from "@/lib/commands/fs";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { type ReadableAtom, type WritableAtom, atom } from "nanostores";
import { fs } from "jarvis-api/ui";

/**
 * Generate a value (unique identified) for a command in an extension
 * @param ext Extension Manifest
 * @param cmd Command in Extension
 * @returns
 */
export function generateItemValue(
  ext: ExtPackageJsonExtra,
  cmd: UiCmd | InlineCmd,
  isDev: boolean,
) {
  return `${ext.jarvis.identifier}/${cmd.name}/${isDev ? "dev" : ""}`;
}

export function cmdToItem(
  cmd: UiCmd | InlineCmd,
  manifest: ExtPackageJsonExtra,
  type: ListItemType,
  isDev: boolean,
): TListItem {
  return {
    title: cmd.name,
    value: generateItemValue(manifest, cmd as UiCmd, isDev),
    description: cmd.description ?? "",
    flags: { isDev },
    type,
    icon: {
      value: manifest.jarvis.icon.icon,
      type: manifest.jarvis.icon.type,
    },
    keywords: cmd.cmds.map((c) => c.value), // TODO: handle regex as well
    identityFilter: true,
  };
}

/**
 * Convert a manifest of Jarvis Extension to a list of TListItem, each represent a command
 * @param manifest
 * @returns
 */
export function manifestToCmdItems(manifest: ExtPackageJsonExtra, isDev: boolean): TListItem[] {
  const uiItems = manifest.jarvis.uiCmds.map((cmd) =>
    cmdToItem(cmd, manifest, ListItemType.Enum["UI Command"], isDev),
  );
  const inlineItems = manifest.jarvis.inlineCmds.map((cmd) =>
    cmdToItem(cmd, manifest, ListItemType.Enum["Inline Command"], isDev),
  );
  return [...uiItems, ...inlineItems];
}

export class Extension implements IExtensionBase {
  manifests: ExtPackageJsonExtra[];
  extPath: string | undefined;
  isDev: boolean;
  extensionName: string;
  //  $listItems, $listItemsDisplay
  $listItems: WritableAtom<TListItem[]>;
  // $listItemsDisplay: ReadableAtom<TListItem[]>;

  constructor(name: string, extPath?: string, isDev: boolean = false) {
    this.extensionName = name;
    this.extPath = extPath;
    this.manifests = [];
    this.isDev = isDev;
    this.$listItems = atom([]);
  }
  async load(): Promise<void> {
    if (!this.extPath || !pathExists(this.extPath)) {
      this.manifests = [];
    } else {
      this.manifests = await loadAllExtensions(this.extPath);
      this.$listItems.set(
        this.manifests.map((manifest) => manifestToCmdItems(manifest, this.isDev)).flat(),
      );
    }
  }
  default(): TListItem[] {
    return this.$listItems.get();
  }

  groups(): TListGroup[] {
    return this.manifests.map((manifest) => ({
      title: manifest.jarvis.name,
      identifier: manifest.jarvis.identifier,
      type: "Extension",
      icon: {
        value: manifest.jarvis.icon.icon,
        type: manifest.jarvis.icon.type,
      },
      items: manifestToCmdItems(manifest, this.isDev),
      flags: { isDev: this.isDev },
    }));
  }

  uninstallExt(identifier: string): Promise<ExtPackageJsonExtra> {
    const found = this.manifests.find((m) => m.jarvis.identifier === identifier);
    console.log(found);
    if (found) {
      return fs.remove(found.extPath, { recursive: true }).then(() => {
        return found;
      });
    } else {
      console.error("Extension not found", identifier);
      return Promise.reject("Extension not found");
    }
  }

  onSelect(item: TListItem): Promise<void> {
    this.manifests.forEach((manifest) => {
      if (item.type == "UI Command") {
        manifest.jarvis.uiCmds.forEach((cmd) => {
          if (item.value === generateItemValue(manifest, cmd, this.isDev)) {
            let url = cmd.main;
            if ($appConfig.value?.devExtLoadUrl && this.isDev && cmd.devMain) {
              url = cmd.devMain;
            } else {
              if (cmd.main.startsWith("http")) {
                url = cmd.main;
              } else {
                const postfix = !cmd.main.endsWith(".html") && !cmd.main.endsWith("/") ? "/" : "";
                url = `http://localhost:1566/${this.isDev ? "dev-" : ""}extensions/${manifest.extFolderName}/${cmd.main}${postfix}`;
              }
            }

            const windowLabel = `ext:${manifest.jarvis.permissions?.join(":")}`;
            console.log("url", url);
            console.log("windowLabel", windowLabel);

            const window = new WebviewWindow(windowLabel, {
              center: cmd.window?.center ?? undefined,
              x: cmd.window?.x ?? undefined,
              y: cmd.window?.y ?? undefined,
              width: cmd.window?.width ?? undefined,
              height: cmd.window?.height ?? undefined,
              minWidth: cmd.window?.minWidth ?? undefined,
              minHeight: cmd.window?.minHeight ?? undefined,
              maxWidth: cmd.window?.maxWidth ?? undefined,
              maxHeight: cmd.window?.maxHeight ?? undefined,
              resizable: cmd.window?.resizable ?? undefined,
              title: cmd.window?.title ?? cmd.name,
              fullscreen: cmd.window?.fullscreen ?? undefined,
              focus: cmd.window?.focus ?? undefined,
              transparent: cmd.window?.transparent ?? undefined,
              maximized: cmd.window?.maximized ?? undefined,
              visible: cmd.window?.visible ?? undefined,
              decorations: cmd.window?.decorations ?? undefined,
              alwaysOnTop: cmd.window?.alwaysOnTop ?? undefined,
              alwaysOnBottom: cmd.window?.alwaysOnBottom ?? undefined,
              contentProtected: cmd.window?.contentProtected ?? undefined,
              skipTaskbar: cmd.window?.skipTaskbar ?? undefined,
              shadow: cmd.window?.shadow ?? undefined,
              theme: cmd.window?.theme ?? undefined,
              titleBarStyle: cmd.window?.titleBarStyle ?? undefined,
              hiddenTitle: cmd.window?.hiddenTitle ?? undefined,
              tabbingIdentifier: cmd.window?.tabbingIdentifier ?? undefined,
              maximizable: cmd.window?.maximizable ?? undefined,
              minimizable: cmd.window?.minimizable ?? undefined,
              closable: cmd.window?.closable ?? undefined,
              parent: cmd.window?.parent ?? undefined,
              visibleOnAllWorkspaces: cmd.window?.visibleOnAllWorkspaces ?? undefined,
              url,
            });
          }
        });
      } else if (item.type === "Inline Command") {
      } else if (item.type === "Remote Command") {
        // const remoteExt = new RemoteExtension();
        // const ext = findRemoteExt(item.value);
        // if (ext) {
        //   const window = new WebviewWindow("ext", {
        //     url: ext.url,
        //     title: item.title,
        //     titleBarStyle: "visible",
        //     // titleBarStyle: TitleBarStyle.parse(uiCmd.window?.titleBarStyle?.toLowerCase() ?? "visible"),
        //     // width: uiCmd.window?.width ?? undefined,
        //     // height: uiCmd.window?.height ?? undefined,
        //   });
        // }
      } else {
        console.error("Unknown command type", item.type);
      }
    });
    // const foundExt = this.
    return Promise.resolve();
  }
}