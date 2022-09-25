import type { Component, JSX } from 'solid-js'
import { createSignal } from 'solid-js'

type Params = {
	state?: string
	room?: string
}

// parse the query parameters from the redirected url
const { searchParams } = new URL(location.href)

const initialParams: Params = {}
const init = (k: keyof Params) => {
	const v = searchParams.get(k)
	v && (initialParams[k] = v)
}

init('state')
init('room')

export const [params, updateParams] = createSignal<Params>(initialParams)

// history
const setParams =
	(method: 'replaceState' | 'pushState') =>
	(newParams: Params, override?: boolean) => {
		const updatedParams = override ? newParams : { ...params(), ...newParams }
		const search = new URLSearchParams(updatedParams)
		const href = `${location.origin}${location.pathname}?${search}${location.hash}`
		if (href === location.href) return
		updateParams(updatedParams)
		history[method](null, '', href)
	}

export const replaceParams = setParams('replaceState')
export const pushParams = setParams('pushState')

const shouldSkip = (event: MouseEvent) =>
	event.defaultPrevented ||
	event.button ||
	event.altKey ||
	event.ctrlKey ||
	event.metaKey ||
	event.shiftKey

export const A: Component<
	JSX.AnchorHTMLAttributes<HTMLAnchorElement> & {
		params: Params
		replace?: boolean
		override?: boolean
	}
> = (props) => {
	const navigate: JSX.EventHandlerUnion<HTMLAnchorElement, MouseEvent> = (
		e
	) => {
		if (shouldSkip(e)) return
		e.preventDefault()
		const action = props.replace ? replaceParams : pushParams
		action(props.params, props.override)

		const click = props.onclick || props.onClick
		typeof click === 'function' && click(e)
	}
	return <a {...props} onclick={navigate} />
}
