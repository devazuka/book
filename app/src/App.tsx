import type { Component, JSX } from 'solid-js'
import { client } from './pocketbase'
import { A, params } from './params'

console.log(client)

const WeekSelect: Component = () => null

const getBold = (name: string) => name === params().room ? 'bold' : 'red'

const Room: Component<{ name: string }> = (props) => {
  const isSelected = () => params().room === props.name
  return (
    <A
      w:cursor="pointer"
      w:font={`${isSelected() ? 'bold' : ''}`}
      w:text='hover:underline'
      params={{ room: props.name }}
    >
      {props.name} {params().room}
    </A>
  )
}

const RoomSelect: Component<{ children: JSX.Element }> = (props) => {
  return <div>{props.children}</div>
}

const MeetingRooms: Component = () => (
  <>
    <h2>Meeting Room & Booth</h2>
    <WeekSelect />
    <RoomSelect>
      <Room name="red" />
      <Room name="blue" />
    </RoomSelect>
  </>
)

export const App: Component = () => (
  <>
    <h1>DEVAZUKA</h1>
    <MeetingRooms />
  </>
)
