import React, { useState } from 'react';
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css';
import StaticLayout from '../components/layouts/StaticLayout';

const ReactQuill = dynamic(import('react-quill'), { ssr: false })


const TestPage = () => {
  const [value, setValue] = useState('')
  const modules = {
    toolbar: null
  }

  const formats = [
    'header',
    'bold', 'italic', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link'
  ]

//   function insertStar() {
//     const cursorPosition = this.quill.getSelection().index;
//     this.quill.insertText(cursorPosition, '★');
//     this.quill.setSelection(cursorPosition + 1);
//   }

  return (
  <StaticLayout sectionTitle="Test Page" subTitle="Quill">
    <ReactQuill theme="snow" modules={modules} formats={formats} value={value} onChange={setValue} />
  </StaticLayout>
)}
export default TestPage