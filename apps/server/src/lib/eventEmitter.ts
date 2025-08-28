import { EventEmitter } from 'events'

export const emitEvent = new EventEmitter<{ updateOrder: [] }>()
