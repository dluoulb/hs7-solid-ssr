import type { Component } from 'solid-js'
import { Counter } from './Counter'

const Page: Component = () => {
  return (
    <>
      <h1>Welcome</h1>
      <div>
        This page is:
        <ul>
          <li>Rendered to HTML.</li>
          <li>
            Interactive. <Counter />
          </li>
        </ul>
      </div>
    </>
  )
}
export default Page
