import React, { useState } from 'react';
import { 
  FaBold, FaItalic, FaUnderline, FaListOl, FaListUl, FaImage,
  FaHeading, FaSmile, FaFont, FaTextHeight, FaCalendarAlt,
  FaFileExport, FaTimes, FaPaperclip, FaPaperPlane
} from 'react-icons/fa';
import { MdFormatColorText, MdAttachFile } from 'react-icons/md';
import './notice.css'; // Assuming you have a CSS file for styling

const Notice = () => {
  const [noticeData, setNoticeData] = useState({
    topic: '',
    content: '',
    attachments: []
  });
  const [fileNames, setFileNames] = useState('No file chosen');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNoticeData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setNoticeData(prev => ({
        ...prev,
        attachments: files
      }));
      setFileNames(files.map(file => file.name).join(', '));
    } else {
      setFileNames('No file chosen');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Notice submitted:', noticeData);
      alert('Notice submitted successfully!');
      
      // Reset form
      setNoticeData({
        topic: '',
        content: '',
        attachments: []
      });
      setFileNames('No file chosen');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting notice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormatButton = (format) => {
    // Enhanced formatting logic would go here
    console.log(`Format ${format} applied`);
  };

  return (
    <div className="notice-container">
      <div className="notice-header">
        <h2>Send New Notice</h2>
        <p className="subtitle">Create notice of announcement from here.</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="notice-box">
          <div className="notice-title-bar">
            <h3>Notice</h3>
            <div className="notice-actions">
              <button type="button" className="icon-button" title="Close">
                <FaTimes />
              </button>
            </div>
          </div>
          
          <div className="toolbar">
            <button type="button" onClick={() => handleFormatButton('Normal')} title="Normal text">
              <span className="text-format">Normal</span>
            </button>
            <button type="button" onClick={() => handleFormatButton('Bold')} title="Bold">
              <FaBold />
            </button>
            <button type="button" onClick={() => handleFormatButton('Italic')} title="Italic">
              <FaItalic />
            </button>
            <button type="button" onClick={() => handleFormatButton('Underline')} title="Underline">
              <FaUnderline />
            </button>
            <button type="button" onClick={() => handleFormatButton('OrderedList')} title="Ordered list">
              <FaListOl />
            </button>
            <button type="button" onClick={() => handleFormatButton('UnorderedList')} title="Unordered list">
              <FaListUl />
            </button>
            <button type="button" onClick={() => handleFormatButton('Media')} title="Insert media">
              <FaImage />
            </button>
            <button type="button" onClick={() => handleFormatButton('Heading')} title="Heading">
              <FaHeading />
            </button>
            <button type="button" onClick={() => handleFormatButton('Emoji')} title="Insert emoji">
              <FaSmile />
            </button>
            <button type="button" onClick={() => handleFormatButton('Font')} title="Font family">
              <FaFont />
            </button>
            <button type="button" onClick={() => handleFormatButton('Size')} title="Font size">
              <FaTextHeight />
            </button>
            <button type="button" onClick={() => handleFormatButton('Date')} title="Insert date">
              <FaCalendarAlt />
            </button>
            <button type="button" onClick={() => handleFormatButton('Export')} title="Export">
              <FaFileExport />
            </button>
          </div>
          
          <div className="input-section">
            <input
              type="text"
              name="topic"
              value={noticeData.topic}
              onChange={handleInputChange}
              placeholder="Notice topic or title"
              className="topic-input"
              required
            />
            <textarea
              name="content"
              value={noticeData.content}
              onChange={handleInputChange}
              placeholder="Write your notice content here..."
              className="content-input"
              required
            />
          </div>
          
          <div className="attachments-section">
            <div className="attachments-header">
              <MdAttachFile className="attachment-icon" />
              <h4>Attachments</h4>
            </div>
            <label className="file-chooser">
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                style={{ display: 'none' }}
              />
              <span className="file-chooser-button">
                <FaPaperclip /> Choose Files
              </span>
            </label>
            <span className="file-status">{fileNames}</span>
          </div>
          
          <button 
            type="submit" 
            className="send-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Sending...'
            ) : (
              <>
                <FaPaperPlane style={{ marginRight: '8px' }} /> Send Notice
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Notice;