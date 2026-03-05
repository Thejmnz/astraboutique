import { useRef, useEffect } from 'react'

export default function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null)

  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || ''
      }
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }

  const insertList = (type) => {
    document.execCommand(type, false, null)
    editorRef.current?.focus()
    handleInput()
  }

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
      <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 font-bold text-sm"
          title="Negrita"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 italic text-sm"
          title="Cursiva"
        >
          I
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => insertList('insertUnorderedList')}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200"
          title="Lista con viñetas"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => insertList('insertOrderedList')}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-sm font-medium"
          title="Lista numerada"
        >
          1.
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        className="min-h-[100px] p-3 focus:outline-none product-notes-display"
        data-placeholder={placeholder || ''}
      />
    </div>
  )
}
