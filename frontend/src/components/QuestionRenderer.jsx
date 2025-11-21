import React from 'react';
import { LIKERT_LABELS } from '../../../shared/index.js';

const QuestionRenderer = ({ question, value, onChange }) => {
  const renderLikert5 = () => {
    // 1 ve 5 için metni iki satıra böl
    const formatLabel = (val) => {
      const label = LIKERT_LABELS[val];
      if (val === 1) {
        // "Kesinlikle Katılmıyorum" -> "Kesinlikle" + "Katılmıyorum"
        return (
          <>
            <div>Kesinlikle</div>
            <div>Katılmıyorum</div>
          </>
        );
      } else if (val === 5) {
        // "Tamamen Katılıyorum" -> "Tamamen" + "Katılıyorum"
        return (
          <>
            <div>Tamamen</div>
            <div>Katılıyorum</div>
          </>
        );
      }
      return label;
    };

    return (
      <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
        {[1, 2, 3, 4, 5].map(val => {
          const fontSize = 'text-[7px] sm:text-xs';
          const isMultiLine = val === 1 || val === 5;
          
          return (
            <button
              key={val}
              type="button"
              onClick={() => onChange(val)}
              className={`py-2.5 sm:py-4 px-0.5 sm:px-3 rounded-button border-2 transition-all ${
                value === val
                  ? 'border-primary bg-primary text-white shadow-lg'
                  : 'border-border hover:border-primary hover:shadow'
              }`}
            >
              <div className="text-lg sm:text-2xl font-bold mb-0.5 sm:mb-2">{val}</div>
              <div className={`${fontSize} leading-tight ${isMultiLine ? '' : 'whitespace-nowrap'} px-0.5`}>
                {formatLabel(val)}
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  const renderNPS = () => (
    <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5 sm:gap-2">
      {[...Array(11)].map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className={`py-2 sm:py-3 rounded-button border-2 transition-all font-semibold text-sm sm:text-base ${
            value === i
              ? 'border-primary bg-primary text-white'
              : 'border-border hover:border-primary'
          }`}
        >
          {i}
        </button>
      ))}
    </div>
  );

  const renderYesNo = () => (
    <div className="flex gap-2 sm:gap-4">
      {['Evet', 'Hayır'].map(option => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`flex-1 py-2.5 sm:py-3 rounded-button border-2 transition-all text-sm sm:text-base ${
            value === option
              ? 'border-primary bg-primary text-white'
              : 'border-border hover:border-primary'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );

  const renderShortText = () => (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="input-field"
      required={question.is_required}
      placeholder="Cevabınızı yazın..."
    />
  );

  const renderLongText = () => (
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="input-field"
      rows={4}
      required={question.is_required}
      placeholder="Görüş ve önerilerinizi yazın..."
    />
  );

  const renderMultipleSingle = () => (
    <div className="space-y-2">
      {question.options?.map(option => (
        <label key={option} className="flex items-center p-2.5 sm:p-3 border-2 border-border rounded-button hover:border-primary cursor-pointer transition-colors">
          <input
            type="radio"
            name={question.id}
            value={option}
            checked={value === option}
            onChange={(e) => onChange(e.target.value)}
            className="mr-2 sm:mr-3 flex-shrink-0"
            required={question.is_required}
          />
          <span className="text-sm sm:text-base">{option}</span>
        </label>
      ))}
    </div>
  );

  const renderMultipleMulti = () => {
    const values = Array.isArray(value) ? value : [];
    
    const handleChange = (option) => {
      if (values.includes(option)) {
        onChange(values.filter(v => v !== option));
      } else {
        onChange([...values, option]);
      }
    };

    return (
      <div className="space-y-2">
        {question.options?.map(option => (
          <label key={option} className="flex items-center p-2.5 sm:p-3 border-2 border-border rounded-button hover:border-primary cursor-pointer transition-colors">
            <input
              type="checkbox"
              value={option}
              checked={values.includes(option)}
              onChange={() => handleChange(option)}
              className="mr-2 sm:mr-3 flex-shrink-0"
            />
            <span className="text-sm sm:text-base">{option}</span>
          </label>
        ))}
      </div>
    );
  };

  const renderDate = () => (
    <input
      type="date"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="input-field"
      required={question.is_required}
    />
  );

  switch (question.type) {
    case 'likert_5':
      return renderLikert5();
    case 'nps_0_10':
      return renderNPS();
    case 'yes_no':
      return renderYesNo();
    case 'short_text':
      return renderShortText();
    case 'long_text':
      return renderLongText();
    case 'multiple_single':
      return renderMultipleSingle();
    case 'multiple_multi':
      return renderMultipleMulti();
    case 'date':
      return renderDate();
    default:
      return <div>Desteklenmeyen soru tipi</div>;
  }
};

export default QuestionRenderer;
