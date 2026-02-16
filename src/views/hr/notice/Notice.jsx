import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const NoticeSystem = () => {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [notices, setNotices] = useState([]);
  const [activeTab, setActiveTab] = useState('create');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    const newNotice = {
      id: Date.now(),
      content,
      date: new Date().toLocaleString('en-US', {
        weekday: 'long',
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      attachments: Array.from(attachments).map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      }))
    };
    
    setNotices([newNotice, ...notices]);
    setContent('');
    setAttachments([]);
    setActiveTab('view');
  };

  const handleFileChange = (e) => {
    setAttachments([...e.target.files]);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      ['blockquote', 'code-block'],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'blockquote', 'code-block',
    'align',
    'list', 'bullet',
    'link', 'image', 'video'
  ];

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="mainbar-grid">
      <div className="pb-4" style={{ overflow: 'auto' }}>
        <div 
          className="container-fluid py-2 ql-snow-dark" 
          style={{ 
            color: 'var(--primaryDashColorDark)', 
            height: '95vh' 
          }}
        >
          {/* Navigation Tabs */}
          <div className="d-flex mb-3">
            <button 
              className={`btn ${activeTab === 'create' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
              onClick={() => switchTab('create')}
            >
              Create Notice
            </button>
            <button 
              className={`btn ${activeTab === 'view' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => switchTab('view')}
            >
              View Notices <span className="badge bg-secondary">{notices.length}</span>
            </button>
          </div>

          {activeTab === 'create' ? (
            <>
              <div className="my-auto mt-2">
                <div className="d-flex align-items-center gap-2">
                  <h5 
                    className="m-0 p-0 text-capitalize" 
                    style={{ 
                      fontWeight: 500, 
                      color: 'var(--PrimaryColorDark)' 
                    }}
                  >
                    Send new Notice
                  </h5>
                </div>
                <p className="m-0" style={{ color: 'var(--Subtittles)' }}>
                  Create notice or announcement from here.
                </p>
              </div>
              
              <form 
                className="mt-3 d-flex flex-column gap-3"
                onSubmit={handleSubmit}
              >
                <div>
                  <label>Notice</label>
                  <div className="quill quill-toolbar-dark">
                    <ReactQuill
                      theme="snow"
                      value={content}
                      onChange={setContent}
                      modules={modules}
                      formats={formats}
                      placeholder="Please mention topic for the notice or announcement"
                      className="ql-container ql-snow"
                    />
                  </div>
                </div>
                
                <div>
                  <label>Attachments</label>
                  <input 
                    className="form-control ms-0 ms-md-auto rounded-2 bg-light text-dark border dark-placeholder" 
                    type="file" 
                    multiple 
                    onChange={handleFileChange}
                  />
                </div>
                
                <div className="d-flex">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={!content.trim()}
                  >
                    Send Notice
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="notice-board">
              <div className="d-flex align-items-center gap-2 mb-3">
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  className="fs-5"
                  height="1em"
                  width="1em"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
                  />
                </svg>
                <h5 
                  className="m-0 p-0 text-capitalize" 
                  style={{ 
                    fontWeight: 500, 
                    color: 'var(--PrimaryColorDark)' 
                  }}
                >
                  Notice Board
                </h5>
                <span className="badge bg-secondary ms-2">{notices.length}</span>
              </div>
              
              {notices.length > 0 ? (
                <div className="notice-list">
                  {notices.map(notice => (
                    <div key={notice.id} className="notice-item mb-4 p-3 border rounded">
                      <div 
                        className="ql-editor" 
                        dangerouslySetInnerHTML={{ __html: notice.content }}
                      />
                      {notice.attachments.length > 0 && (
                        <div className="mt-3">
                          <h6 className="mb-2">Attachments:</h6>
                          <ul className="list-unstyled">
                            {notice.attachments.map((file, index) => (
                              <li key={index} className="d-flex align-items-center">
                                <svg
                                  stroke="currentColor"
                                  fill="currentColor"
                                  strokeWidth="0"
                                  viewBox="0 0 16 16"
                                  height="1em"
                                  width="1em"
                                  className="me-2"
                                >
                                  <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z" />
                                </svg>
                                <span>{file.name}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="text-end text-muted small mt-2">
                        {notice.date}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 24 24"
                    height="100px"
                    width="100px"
                    style={{ opacity: 0.6 }}
                  >
                    <path d="M4 2v20h16V2H4zm14 18H6V4h12v16zm-7-8H7v-2h4v2zm6 0h-4v-2h4v2zm-6 4H7v-2h4v2zm6 0h-4v-2h4v2z"></path>
                  </svg>
                  <p className="mt-3" style={{ opacity: 0.6, fontSize: '13px' }}>
                    No notices available at the moment.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div 
        className="HrPannelFooter bg-dark w-100 text-white" 
        style={{ 
          zIndex: 50, 
          position: 'absolute', 
          bottom: 0 
        }}
      >
        <div 
          className="d-flex justify-content-center align-items-center gap-5 p-2" 
          style={{ 
            backgroundColor: 'var(--primaryDashMenuColor)', 
            color: 'var(--primaryDashColorDark)' 
          }}
        >
          <span className="d-none d-md-flex">
            <span className="text-capitalize">
              {new Date().toLocaleString('en-US', {
                weekday: 'long',
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
              })}
            </span>
          </span>
          <span className="d-flex align-items-center gap-2">
            <svg 
              stroke="currentColor" 
              fill="none" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              height="1em" 
              width="1em"
            >
              <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
              <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
              <line x1="12" y1="20" x2="12.01" y2="20"></line>
            </svg>
            <span className="d-none d-md-flex">Connected</span>
          </span>
          <span>
            <svg 
              stroke="currentColor" 
              fill="currentColor" 
              strokeWidth="0" 
              viewBox="0 0 496 512" 
              height="1em" 
              width="1em"
            >
              <path d="M131.5 217.5L55.1 100.1c47.6-59.2 119-91.8 192-92.1 42.3-.3 85.5 10.5 124.8 33.2 43.4 25.2 76.4 61.4 97.4 103L264 133.4c-58.1-3.4-113.4 29.3-132.5 84.1zm32.9 38.5c0 46.2 37.4 83.6 83.6 83.6s83.6-37.4 83.6-83.6-37.4-83.6-83.6-83.6-83.6 37.3-83.6 83.6zm314.9-89.2L339.6 174c37.9 44.3 38.5 108.2 6.6 157.2L234.1 503.6c46.5 2.5 94.4-7.7 137.8-32.9 107.4-62 150.9-192 107.4-303.9zM133.7 303.6L40.4 120.1C14.9 159.1 0 205.9 0 256c0 124 90.8 226.7 209.5 244.9l63.7-124.8c-57.6 10.8-113.2-20.8-139.5-72.5z"></path>
            </svg>
            Chrome
          </span>
          <span title="IP Address" className="d-flex align-items-center gap-1">
            <svg 
              stroke="currentColor" 
              fill="none" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              height="1em" 
              width="1em"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M16 2a3 3 0 0 1 2.995 2.824l.005 .176v14a3 3 0 0 1 -2.824 2.995l-.176 .005h-8a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005h8zm-4 14a1 1 0 0 0 -.993 .883l-.007 .117l.007 .127a1 1 0 0 0 1.986 0l.007 -.117l-.007 -.127a1 1 0 0 0 -.993 -.883zm1 -12h-2l-.117 .007a1 1 0 0 0 0 1.986l.117 .007h2l.117 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" strokeWidth="0" fill="currentColor"></path>
            </svg>
            122.161.52.228
          </span>
          <div>Unable to retrieve your location.</div>
        </div>
      </div>
    </div>
  );
};

export default NoticeSystem;