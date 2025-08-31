import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { trainingAPI } from '../../services/api';
import { ROUTES } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const QuizTake = () => {
  const { trainingId } = useParams();
  const [answers, setAnswers] = useState([]);
  const { loading, error, execute, data: training } = useApi();
  const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 100;

    useEffect(() => {
      const endpoint = isAdmin() ? trainingAPI.getAllTrainings : trainingAPI.getTrainings;
      execute(() => endpoint({ page: currentPage, limit: pageSize }));
    }, [execute, currentPage]);

  const selectedTraining = training?.find(t => t._id === trainingId);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    try {
      await execute(() => trainingAPI.submitQuiz({ trainingId, answers }));
      navigate(ROUTES.TRAININGS);
    } catch (err) {
      console.error('Quiz submission failed:', err);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Take Quiz</h2>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500">{error}</p>}
      {selectedTraining && selectedTraining.quizzes.map((q, index) => (
        <div key={index} className="mb-4">
          <p className="font-medium">{q.question}</p>
          {q.options.map((opt, optIndex) => (
            <div key={optIndex}>
              <input
                type="radio"
                name={`question-${index}`}
                value={opt}
                checked={answers[index] === opt}
                onChange={() => handleAnswerChange(index, opt)}
              />
              <label className="ml-2">{opt}</label>
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit} className="btn-primary w-full" disabled={loading || !selectedTraining}>
        {loading ? <LoadingSpinner size="sm" /> : 'Submit Quiz'}
      </button>
    </div>
  );
};

export default QuizTake;