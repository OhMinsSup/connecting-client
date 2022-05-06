import React, { useEffect } from 'react'

import { Plus } from '@styled-icons/boxicons-regular'
import IconButton from '../Icon/IconButton'

type BehaviourType =
  | { behaviour: 'ask'; onChange: (file: File) => void }
  | { behaviour: 'upload'; onUpload: (id: string) => Promise<void> }
  | {
      behaviour: 'multi'
      onChange: (files: File[]) => void
      append?: (files: File[]) => void
    }

type StyleType =
  | {
      style: 'icon' | 'banner'
      width?: number
      height?: number
      previewURL?: string
      defaultPreview?: string
      desaturateDefault?: boolean
    }
  | {
      style: 'attachment'
      attached: boolean
      uploading: boolean
      cancel: () => void
      size?: number
    }

type FileUploadsProps = BehaviourType &
  StyleType & {
    fileType: 'backgrounds' | 'icons' | 'avatars' | 'attachments' | 'banners'
    maxFileSize: number
    remove: () => Promise<void>
  }

const FileUploads: React.FC<FileUploadsProps> = (props) => {
  //   const [uploading, setUploading] = useState(false)

  if (props.behaviour === 'multi' && props.append) {
    // eslint-disable-next-line
    useEffect(() => {
      // File pasting.
      function paste(e: ClipboardEvent) {
        const items = e.clipboardData?.items
        if (typeof items === 'undefined') return
        if (props.behaviour !== 'multi' || !props.append) return

        const files = []
        for (const item of items) {
          if (!item.type.startsWith('text/')) {
            const blob = item.getAsFile()
            if (blob) {
              if (blob.size > props.maxFileSize) {
                // openScreen({
                //   id: 'error',
                //   error: 'FileTooLarge',
                // })
              }

              files.push(blob)
            }
          }
        }

        props.append(files)
      }

      // Let the browser know we can drop files.
      function dragover(e: DragEvent) {
        e.stopPropagation()
        e.preventDefault()
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'
      }

      // File dropping.
      function drop(e: DragEvent) {
        e.preventDefault()
        if (props.behaviour !== 'multi' || !props.append) return

        const dropped = e.dataTransfer?.files
        if (dropped) {
          const files = []
          for (const item of dropped) {
            if (item.size > props.maxFileSize) {
              //   openScreen({ id: 'error', error: 'FileTooLarge' })
            }

            files.push(item)
          }

          props.append(files)
        }
      }

      document.addEventListener('paste', paste)
      document.addEventListener('dragover', dragover)
      document.addEventListener('drop', drop)

      return () => {
        document.removeEventListener('paste', paste)
        document.removeEventListener('dragover', dragover)
        document.removeEventListener('drop', drop)
      }
    }, [props, props.append])
  }

  if (props.style === 'icon' || props.style === 'banner') {
    // const { style, previewURL, defaultPreview, width, height } = props
    return null
  } else if (props.style === 'attachment') {
    const {
      attached,
      uploading,
      // cancel,
      size,
    } = props
    return (
      <IconButton
        onClick={() => {
          //   if (uploading) return cancel()
          //   if (attached) return remove()
          //   onClick()
        }}
        rotate={uploading || attached ? '45deg' : undefined}
      >
        <Plus size={size} />
      </IconButton>
    )
  }

  return null
}

export default FileUploads
