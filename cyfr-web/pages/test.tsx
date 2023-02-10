import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import StaticLayout from '../components/layouts/StaticLayout';
import SimpleQuill from '../components/ui/SimpleQuill';

const TestPage = (_props: any) => {
  const [value, setValue] = useState('')

  return (
  <StaticLayout sectionTitle="Test Page" subTitle="Quill">
    <SimpleQuill content={value} setContent={setValue} />
  </StaticLayout>
)}
export default TestPage