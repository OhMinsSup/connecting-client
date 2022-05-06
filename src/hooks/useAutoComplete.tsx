import { useState } from 'react'
import type React from 'react'
import type { ChannelSchema, UserSchema } from '../api/schema/model'

export type AutoCompleteState =
  | { type: 'none' }
  | ({ selected: number; within: boolean } & (
      | {
          type: 'emoji'
          matches: string[]
        }
      | {
          type: 'user'
          matches: UserSchema[]
        }
      | {
          type: 'channel'
          matches: ChannelSchema[]
        }
    ))

export type SearchClues = {
  users?: { type: 'channel'; idx: number } | { type: 'all' }
  channels?: { workspace: number | null }
}

export type AutoCompleteProps = {
  detached?: boolean
  state: AutoCompleteState
  setState: React.Dispatch<React.SetStateAction<AutoCompleteState>>
  //   onKeyUp: (ev: KeyboardEvent) => void
  //   onKeyDown: (ev: KeyboardEvent) => boolean
  onChange: (ev: React.ChangeEvent<HTMLTextAreaElement>) => void
  //   onClick: React.MouseEventHandler<HTMLButtonElement>
  //   onFocus: React.FocusEventHandler<HTMLTextAreaElement>
  //   onBlur: React.FocusEventHandler<HTMLTextAreaElement>
}

const useAutoComplete = (setValue: (v?: string) => void, searchClues?: SearchClues) => {
  const [state, setState] = useState<AutoCompleteState>({ type: 'none' })
  const [focused, setFocused] = useState(false)
  console.log(searchClues, setFocused)

  const findSearchString = (el: HTMLTextAreaElement): ['emoji' | 'user' | 'channel', string, number] | undefined => {
    if (el.selectionStart === el.selectionEnd) {
      const cursor = el.selectionStart
      const content = el.value.slice(0, cursor)

      const valid = /\w/

      let j = content.length - 1
      if (content[j] === '@') {
        return ['user', '', j]
      } else if (content[j] === '#') {
        return ['channel', '', j]
      }

      while (j >= 0 && valid.test(content[j])) {
        j--
      }

      if (j === -1) return
      const current = content[j]

      if (current === ':' || current === '@' || current === '#') {
        const search = content.slice(j + 1, content.length)
        const minLen = current === ':' ? 2 : 1

        if (search.length >= minLen) {
          return [current === '#' ? 'channel' : current === ':' ? 'emoji' : 'user', search.toLowerCase(), j + 1]
        }
      }
    }
  }

  const selectCurrent = (el: HTMLTextAreaElement) => {
    if (state.type !== 'none') {
      const result = findSearchString(el)
      if (result) {
        const [, search, index] = result

        const content = el.value.split('')
        if (state.type === 'emoji') {
          content.splice(index, search.length, state.matches[state.selected], ': ')
        } else if (state.type === 'user') {
          content.splice(index - 1, search.length + 1, '<@', state.matches[state.selected].profile?.nickname, '> ')
        } else {
          content.splice(index - 1, search.length + 1, '<#', state.matches[state.selected].name, '> ')
        }

        setValue(content.join(''))
      }
    }
  }
  console.log('selectCurrent', selectCurrent)

  const onChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = ev.currentTarget

    const result = findSearchString(el)
    console.log(result)
    // if (result) {
    //   const [type, search] = result
    //   const regex = new RegExp(search, 'i')

    //   if (type === 'emoji') {
    //     // ! TODO: we should convert it to a Binary Search Tree and use that
    //     const matches = Object.keys(emojiDictionary)
    //       .filter((emoji: string) => emoji.match(regex))
    //       .splice(0, 5)

    //     if (matches.length > 0) {
    //       const currentPosition = state.type !== 'none' ? state.selected : 0

    //       setState({
    //         type: 'emoji',
    //         matches,
    //         selected: Math.min(currentPosition, matches.length - 1),
    //         within: false,
    //       })

    //       return
    //     }
    //   }

    //   if (type === 'user' && searchClues?.users) {
    //     let users: User[] = []
    //     switch (searchClues.users.type) {
    //       case 'all':
    //         users = [...client.users.values()]
    //         break
    //       case 'channel': {
    //         const channel = client.channels.get(searchClues.users.id)
    //         switch (channel?.channel_type) {
    //           case 'Group':
    //           case 'DirectMessage':
    //             users = channel.recipients!.filter((x) => typeof x !== 'undefined') as User[]
    //             break
    //           case 'TextChannel':
    //             {
    //               const server = channel.server_id
    //               users = [...client.members.keys()]
    //                 .map((x) => JSON.parse(x))
    //                 .filter((x) => x.server === server)
    //                 .map((x) => client.users.get(x.user))
    //                 .filter((x) => typeof x !== 'undefined') as User[]
    //             }
    //             break
    //           default:
    //             return
    //         }
    //       }
    //     }

    //     users = users.filter((x) => x._id !== '00000000000000000000000000')

    //     const matches = (search.length > 0 ? users.filter((user) => user.username.toLowerCase().match(regex)) : users)
    //       .splice(0, 5)
    //       .filter((x) => typeof x !== 'undefined')

    //     if (matches.length > 0) {
    //       const currentPosition = state.type !== 'none' ? state.selected : 0

    //       setState({
    //         type: 'user',
    //         matches,
    //         selected: Math.min(currentPosition, matches.length - 1),
    //         within: false,
    //       })

    //       return
    //     }
    //   }

    //   if (type === 'channel' && searchClues?.channels) {
    //     const channels = client.servers.get(searchClues.channels.server)?.channels.filter((x) => typeof x !== 'undefined') as Channel[]

    //     const matches = (search.length > 0 ? channels.filter((channel) => channel.name!.toLowerCase().match(regex)) : channels)
    //       .splice(0, 5)
    //       .filter((x) => typeof x !== 'undefined')

    //     if (matches.length > 0) {
    //       const currentPosition = state.type !== 'none' ? state.selected : 0

    //       setState({
    //         type: 'channel',
    //         matches,
    //         selected: Math.min(currentPosition, matches.length - 1),
    //         within: false,
    //       })

    //       return
    //     }
    //   }
    // }

    // if (state.type !== 'none') {
    //   setState({ type: 'none' })
    // }
  }

  return {
    state: focused ? state : { type: 'none' },
    setState,

    // onClick,
    onChange,
    // onKeyUp,
    // onKeyDown,
    // onFocus,
    // onBlur,
  }
}

export default useAutoComplete
