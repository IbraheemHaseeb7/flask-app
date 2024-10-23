import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "tailwindcss"
import path from "path"

export default defineConfig({
	plugins: [react()],
	css: {
		postcss: {
			plugins: [tailwindcss()]
		}
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src")
		}
	}
})
