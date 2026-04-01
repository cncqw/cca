// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'

const LOCALE_STORAGE_KEY = 'preferred-locale'

const getLocaleFromPath = (path: string) => (path.startsWith('/zh/') ? 'zh' : 'root')

const getRedirectPath = (path: string, preferredLocale: string) => {
  if (preferredLocale === 'zh' && path === '/') {
    return '/zh/'
  }

  if (preferredLocale === 'root' && path === '/zh/') {
    return '/'
  }

  return null
}

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ router }) {
    if (typeof window === 'undefined') {
      return
    }

    router.onAfterRouteChange = (to: string) => {
      const locale = getLocaleFromPath(to)
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    }

    const currentLocale = getLocaleFromPath(window.location.pathname)
    const preferredLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY)

    if (!preferredLocale) {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, currentLocale)
      return
    }

    const redirectPath = getRedirectPath(window.location.pathname, preferredLocale)
    if (redirectPath) {
      router.go(redirectPath)
    }
  }
} satisfies Theme
