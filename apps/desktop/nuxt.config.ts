import path from "path"
import { z } from "zod"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false,
	css: ["@/assets/css/themes.css"],
	devtools: { enabled: true },

	modules: [
		"@nuxtjs/mdc",
		"@pinia/nuxt",
		"@pinia-plugin-persistedstate/nuxt",
		"@nuxtjs/tailwindcss",
		"shadcn-nuxt",
		"@vueuse/nuxt",
		"@element-plus/nuxt",
		"@formkit/auto-animate/nuxt",
		"@nuxt/image",
		"dayjs-nuxt",
		// "@nuxtjs/supabase"
		"@nuxtjs/device",
		"@nuxt/icon"
		// "@nuxtjs/mdc"
	],
	// alias: {
	// 	"@kkui": "../../../packages/ui/src"
	// },
	// vite: {
	// 	resolve: {
	// 		alias: {
	// 			"@kkui": path.resolve(__dirname, "../../packages/ui/src")
	// 		}
	// 	}
	// },
	nitro: {
		output: {
			publicDir: "dist"
		}
	},
	shadcn: {
		/**
		 * Prefix for all the imported component
		 */
		prefix: "",
		/**
		 * Directory that the component lives in.
		 * @default "./components/ui"
		 */
		componentDir: "./components/ui"
	},

	// elementPlus: {
	//   icon: "ElIcon",
	//   importStyle: "scss",
	//   themes: ["dark"],
	// },
	// app: {
	//   pageTransition: { name: "page", mode: "out-in" },
	// },

	runtimeConfig: {
		public: {
			SUPABASE_URL: z.string().describe("SUPABASE_URL").parse(process.env.SUPABASE_URL),
			SUPABASE_ANON_KEY: z
				.string()
				.describe("SUPABASE_ANON_KEY")
				.parse(process.env.SUPABASE_ANON_KEY),
			SUPABASE_GRAPHQL_ENDPOINT: z
				.string()
				.describe("SUPABASE_GRAPHQL_ENDPOINT")
				.parse(process.env.SUPABASE_GRAPHQL_ENDPOINT),
			isDev: process.env.NODE_ENV === "development",
			posthogPublicKey: z
				.string()
				.describe("POSTHOG_PUBLIC_KEY")
				.parse(process.env.POSTHOG_PUBLIC_KEY),
			posthogHost: z.string().describe("POSTHOG_HOST").parse(process.env.POSTHOG_HOST)
		}
	},
	// sourcemap: true,
	// supabase: {
	//   key: process.env.SUPABASE_ANON_KEY,
	//   url: process.env.SUPABASE_URL
	// },
	compatibilityDate: "2024-04-03"
})
