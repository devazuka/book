import './classless.css'
import './admin.css'

import PocketBase, { Admin, User } from 'pocketbase'
import type * as P from 'pocketbase'

const client = new PocketBase('https://book.devazuka.com')

type Page = 'sign-in' | 'data'
type Croissant = {
  id: string
  at: string
  name: string
  email?: string
  image?: string
  until?: string
}

type Stripe = {
  id: string
  at: string
  status: 'succeeded' | 'failed' | 'pending'
  product: 'Monthly Pass' | 'Week Pass' | 'Full Day Pass'
}

const once = (
  src: HTMLElement,
  event: keyof HTMLElementEventMap,
  opts?: AddEventListenerOptions
) =>
  new Promise<Event>((resolve) =>
    src.addEventListener(event, resolve, { once: true, ...opts })
  )

const navigate = (page: Page) => (document.body.dataset.page = page)

const onFormSubmit = async (form: HTMLFormElement) => {
  const event = await once(form, 'submit')
  event.preventDefault()
  return Object.fromEntries(new FormData(form))
}

const signInForm = document.getElementById('sign-in') as HTMLFormElement
const preEl = signInForm.querySelector('pre')
const submitEl = signInForm.querySelector(
  'button[type=submit]'
) as HTMLButtonElement
const signIn = async (): Promise<User | Admin> => {
  if (client.authStore.isValid && client.authStore.model)
    return client.authStore.model
  try {
    const { email, password } = await onFormSubmit(signInForm)
    if (typeof email !== 'string' || typeof password !== 'string') {
      preEl && (preEl.textContent = `Missing credentials`)
      return signIn()
    }
    preEl && (preEl.textContent = 'Loading...')
    submitEl && (submitEl.disabled = true)
    await client.admins.authViaEmail(email, password)
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack)
      preEl && (preEl.textContent = err.message)
    }
  }
  submitEl && (submitEl.disabled = false)
  return signIn()
}

const formatDate = (date: string | Date) => String(date).slice(5, -7)

type Formats<T> = {
  [Property in keyof T]?: (
    value: T[Property],
    record: T,
    key: Property
  ) => string | Node
}

const generateList = async <T>(
  size: number,
  sub: string,
  format: Formats<T>
) => {
  const recordsCache = new Map()
  // list latest payments
  const list = await client.records.getList(sub, 1, size, {
    // filter: '', // maybe do some filtering like, no failed ?
    sort: '-at',
  })

  const table = document.querySelector(`#${sub} table`) as HTMLTableElement
  const trTemplate = table.querySelector('tbody tr') as HTMLTableRowElement
  table.append()
  const tBody = trTemplate.parentNode as HTMLTableSectionElement
  trTemplate.remove()
  const createRecordEntry = (record: P.Record) => {
    const tr = trTemplate.cloneNode(true) as HTMLTableRowElement
    tr.id = record.id
    const cache = new Map()
    for (const td of tr.children || []) {
      const key = td.className
      const value = record[key]
      const formatter = format[key as keyof T] || String
      cache.set(key, { value, formatter, td })
      td.append(formatter(value, record as T, key as keyof T))
    }
    recordsCache.set(record.id, cache)
    return tr
  }
  const trs = list.items.map(createRecordEntry)
  tBody.append(...trs)

  table.style.opacity = '1'

  const removeChangeClass = (e: MouseEvent) =>
    e.target instanceof HTMLElement && e.target.classList.remove('changed')

  await new Promise((s) => setTimeout(s, 1000))
  await client.realtime.subscribe(sub, ({ action, record }) => {
    // new event !
    if (action === 'update') {
      // if updated, check if present in the list and update
      const cacheEntry = recordsCache.get(record.id)
      if (!cacheEntry) return
      for (const [key, cache] of cacheEntry) {
        const newValue = record[key]
        const { value, td, formatter } = cache
        if (newValue === value) continue
        while (td.firstChild) td.firstChild.remove()
        td.append(formatter(newValue, record, key))
        cache.value = newValue
        td.classList.add('changed')
        td.addEventListener('mousemove', removeChangeClass, { once: true })
        // TODO: add a class to show it just changed ?
      }
    } else if (action === 'create') {
      if (trs.length >= size) {
        const last = trs.pop()
        if (last) {
          recordsCache.delete(last.id)
          last.remove()
        }
      }

      const tr = createRecordEntry(record)
      trs.unshift(tr)
      tBody.append(...trs)
    }
    // if removed, ignore
    console.log(`${sub}/${action}`, record)
  })
}

navigate('sign-in')

signIn()
  .then(() => navigate('data'))
  .then(() =>
    Promise.all([
      generateList<Stripe>(15, 'stripe', {
        status: (src) => {
          if (src === 'succeeded') return '🟢'
          return src === 'failed' ? '🔴' : '🟡'
        },
        at: formatDate,
        product: (src) => {
          const pass = src.split(' ').at(-2) || src
          if (pass === 'Monthly') return 'Month'
          return pass
        },
      }),
      generateList<Croissant>(10, 'croissant', {
        image: (src, record) => {
          const div = document.createElement('div')
          src || (src = `https://robohash.org/${record.email || record.name}`)
          div.style.backgroundImage = `url('${src}')`
          return div
        },
        at: formatDate,
        until: (value, record) => {
          if (!value) return '🟢'
          const diff = new Date(value).getTime() - new Date(record.at).getTime()
          if (diff < 60000) return Math.floor(diff / 1000) + 's'
          if (diff < 60 * 60000) return Math.floor(diff / 60000) + 'm'
          if (diff < 24 * 60 * 60000)
            return Math.floor(diff / (60 * 60000)) + 'h'
          return formatDate(value)
        },
      }),
    ])
  )
