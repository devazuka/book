import { AttributifyNames } from 'windicss/types/jsx'

type Prefix = 'w:' // change it to your prefix

declare module "solid-js" {
  namespace JSX {
    interface HTMLAttributes<T> extends Partial<Record<AttributifyNames<Prefix>, string>> {}
  }
}