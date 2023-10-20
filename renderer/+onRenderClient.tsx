// https://vike.dev/onRenderClient
export { onRenderClient }

import { hydrate, render } from 'solid-js/web'
import { PageLayout } from './PageLayout'
import type { OnRenderClientAsync, PageContextClient } from 'vike/types'
import { createStore, reconcile } from 'solid-js/store'

let dispose: () => void
let rendered = false

const [pageContextStore, setPageContext] = createStore<PageContextClient>({} as PageContextClient)

const onRenderClient: OnRenderClientAsync = async (pageContext): ReturnType<OnRenderClientAsync> => {
  pageContext = removeUnmergableInternals(pageContext)

  if (!rendered) {
    // Dispose to prevent duplicate pages when navigating.
    if (dispose) dispose()

    setPageContext(pageContext)

    const container = document.getElementById('page-view')!
    if (pageContext.isHydration) {
      dispose = hydrate(() => <PageLayout pageContext={pageContextStore} />, container)
    } else {
      dispose = render(() => <PageLayout pageContext={pageContextStore} />, container)
    }
    rendered = true
  } else {
    setPageContext(reconcile(pageContext))
  }
}

// Avoid reconcile() to throw:
// ```
// dev.js:135 Uncaught (in promise) TypeError: Cannot assign to read only property 'Page' of object '[object Module]'
//   at setProperty (dev.js:135:70)
//   at applyState (dev.js:320:5)
// ```
// TODO/v1-release: remove workaround since _pageFilesAll and _pageFilesLoaded aren't used by the V1 design
function removeUnmergableInternals<T>(pageContext: T): T {
  // Remove pageContext properties that cannot be reassigned by reconcile()
  const pageContextFixed = { ...pageContext }
  // @ts-ignore
  delete pageContextFixed._pageFilesAll
  // @ts-ignore
  delete pageContextFixed._pageFilesLoaded
  return pageContextFixed
}
