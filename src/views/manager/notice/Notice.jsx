import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
 
const Notice = () => {
  const [content, setContent] = useState('')
  const [file, setFile] = useState(null)
 
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Notice:', content)
    console.log('Attachment:', file)
  }
 
  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded">
      <div className="mb-6 text-left">
        <h2 className="text-2xl font-bold text-blue-800">Send New Notice</h2>
        <p className="text-sm text-gray-600">Create notice or announcement from here.</p>
      </div>
 
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block font-semibold mb-2">Notice</label>
          <div className="mb-4">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              placeholder="Please mention topic for the notice or announcement"
              style={{ height: '300px' }}
            />
          </div>
        </div>
 
        {/* Extra spacing before the attachments section */}
        <div className="mb-12"></div>
 
        <div className="mx-3" style={{ paddingTop: '35px' }}>
          <label className="block font-semibold mb-3">Attachments :</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 w-full"
          />
        </div>
 
        <div className="text-left">
        <button type="button" class="btn btn-primary">Send Notice</button>
        </div>
      </form>
    </div>
  )
}
 
export default Notice