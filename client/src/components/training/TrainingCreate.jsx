import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { trainingAPI } from '../../services/api';
import { DEPARTMENTS, ROUTES } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';

const TrainingCreate = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    assignedDepartments: [],
    quizzes: []
  });
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizOptions, setQuizOptions] = useState(['', '', '', '']);
  const [quizAnswer, setQuizAnswer] = useState('');
  const { loading, error, execute } = useApi();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        assignedDepartments: checked
          ? [...prev.assignedDepartments, value]
          : prev.assignedDepartments.filter(d => d !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...quizOptions];
    newOptions[index] = value;
    setQuizOptions(newOptions);
  };

  const addQuiz = () => {
    if (quizQuestion && quizAnswer && quizOptions.every(opt => opt)) {
      setFormData(prev => ({
        ...prev,
        quizzes: [...prev.quizzes, { question: quizQuestion, options: quizOptions, answer: quizAnswer }]
      }));
      setQuizQuestion('');
      setQuizOptions(['', '', '', '']);
      setQuizAnswer('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title: formData.title,
      content: formData.content,
      assignedDepartments: JSON.stringify(formData.assignedDepartments),
      quizzes: JSON.stringify(formData.quizzes)
    };

    try {
      await execute(() => trainingAPI.createTraining(data));
      navigate(ROUTES.TRAININGS);
    } catch (err) {
      console.error('Training creation failed:', err);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create Training</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="form-label">Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-input" required />
        </div>
        <div className="mb-4">
          <label className="form-label">Content (URL or Text)</label>
          <textarea name="content" value={formData.content} onChange={handleChange} className="form-input h-32" required />
        </div>
        <div className="mb-4">
          <label className="form-label">Assigned Departments</label>
          <div className="grid grid-cols-2 gap-2">
            {DEPARTMENTS.map(dept => (
              <div key={dept} className="flex items-center">
                <input type="checkbox" id={dept} value={dept} checked={formData.assignedDepartments.includes(dept)} onChange={handleChange} className="mr-2" />
                <label htmlFor={dept}>{dept}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="form-label">Add Quiz Question</label>
          <input type="text" value={quizQuestion} onChange={(e) => setQuizQuestion(e.target.value)} className="form-input mb-2" placeholder="Question" />
          {quizOptions.map((opt, idx) => (
            <input key={idx} type="text" value={opt} onChange={(e) => handleOptionChange(idx, e.target.value)} className="form-input mb-2" placeholder={`Option ${idx + 1}`} />
          ))}
          <input type="text" value={quizAnswer} onChange={(e) => setQuizAnswer(e.target.value)} className="form-input mb-2" placeholder="Correct Answer" />
          <button type="button" onClick={addQuiz} className="btn-secondary">Add Question</button>
        </div>
        <div className="mb-4">
          <h3 className="font-medium">Added Quizzes</h3>
          {formData.quizzes.map((q, idx) => (
            <div key={idx} className="border p-2 mt-2">{q.question} - Answer: {q.answer}</div>
          ))}
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? <LoadingSpinner size="sm" /> : 'Create Training'}
        </button>
      </form>
    </div>
  );
};

export default TrainingCreate;