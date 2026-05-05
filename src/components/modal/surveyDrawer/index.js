'use client'
import React, { useState } from 'react'
import styles from './surveyDrawer.module.scss'
import CloseIcon from '@/icons/closeIcon'
import { submitTask } from '@/services/task'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import TaskStatusModal from '@/components/modal/taskStatusModal'

export default function SurveyDrawer({ isOpen, onClose, task, onTaskSubmitted }) {
    const [answers, setAnswers] = useState({})
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
    const { fetchAndSetProfile } = useAuth()

    const isSubmission = task?.isSubmission || false;
    const submissionStatus = task?.status || task?.task_status;

    const computedStatus = isSubmission ? (submissionStatus === 'pending' ? 'review' : submissionStatus) : 'review';
    const computedReward = isSubmission
        ? (task?.earning_type === 'CASHBACKPOINT'
            ? (task?.task_performance_cashpoints_amount_earned || task?.earnedPoints || '0')
            : (task?.task_performance_real_amount_earned || task?.earnedAmount || '0'))
        : (task?.reward || '0');
    const computedRewardType = isSubmission
        ? (task?.earning_type === 'CASHBACKPOINT' ? 'coin' : 'rupee')
        : (task?.rewardType || 'rupee');

    React.useEffect(() => {
        if (isOpen) {
            if (isSubmission) {
                setIsStatusModalOpen(true);
            } else {
                setAnswers({})
                setErrors({})
                setIsSubmitting(false)
                setIsStatusModalOpen(false)
            }
        }
    }, [isOpen, isSubmission])

    if (!isOpen || !task) return null

    const survey = task.surveys?.[0] || {}
    const questions = survey.questions || []
    const surveyTitle = survey.survey_title || task.title || 'Survey'
    const surveyDescription = survey.survey_short_description || task.description || ''

    const handleChange = (id, value) => {
        setAnswers(prev => ({ ...prev, [id]: value }))
        if (errors[id]) setErrors(prev => ({ ...prev, [id]: null }))
    }

    const handleCheckbox = (id, val, checked) => {
        setAnswers(prev => {
            const cur = Array.isArray(prev[id]) ? prev[id] : []
            return { ...prev, [id]: checked ? [...cur, val] : cur.filter(v => v !== val) }
        })
        if (errors[id]) setErrors(prev => ({ ...prev, [id]: null }))
    }

    const handleClear = () => {
        setAnswers({})
        setErrors({})
    }

    const validate = () => {
        const newErrors = {}
        for (const q of questions) {
            if (!q.is_required) continue
            const a = answers[q.id]
            if (!a || (Array.isArray(a) && !a.length) || (typeof a === 'string' && !a.trim())) {
                newErrors[q.id] = 'This is a required question.'
            }
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) return

        try {
            setIsSubmitting(true)
            const formData = new FormData()
            formData.append('task_campaign_id', task.rawData?.id || task.id)

            const surveyResponses = []
            questions.forEach(q => {
                const a = answers[q.id]
                if (a === undefined || a === null || (Array.isArray(a) && a.length === 0) || (typeof a === 'string' && !a.trim())) {
                    return // skip empty
                }

                const type = q.question_type?.toLowerCase()

                if (type === 'multiple_choice' || type === 'radio' || type === 'dropdown' || type === 'select') {
                    if (a === '__other__') {
                        surveyResponses.push({
                            survey_id: survey.id,
                            question_id: q.id,
                            response_text: null,
                            selected_option: null,
                            is_other_option_selected: true
                        })
                    } else {
                        surveyResponses.push({
                            survey_id: survey.id,
                            question_id: q.id,
                            response_text: null,
                            selected_option: a,
                            is_other_option_selected: false
                        })
                    }
                } else if (type === 'checkbox' || type === 'checkboxes') {
                    if (Array.isArray(a)) {
                        const selectedOptions = a.filter(val => val !== '__other__')
                        const hasOther = a.includes('__other__')

                        surveyResponses.push({
                            survey_id: survey.id,
                            question_id: q.id,
                            response_text: null,
                            selected_option: selectedOptions,
                            is_other_option_selected: hasOther
                        })
                    }
                } else {
                    surveyResponses.push({
                        survey_id: survey.id,
                        question_id: q.id,
                        response_text: String(a),
                        selected_option: null,
                        is_other_option_selected: false
                    })
                }
            })

            formData.append('survey_responses', JSON.stringify(surveyResponses))

            const response = await submitTask(formData)
            if (response.success) {
                toast.success('Survey submitted successfully!')
                setIsStatusModalOpen(true)
                await fetchAndSetProfile()
                if (onTaskSubmitted) onTaskSubmitted()
            }
        } catch (error) {
            console.error('Error submitting survey:', error)
            toast.error(error?.message || 'Failed to submit survey')
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderMedia = (question) => {
        if (!question.media_url) return null
        const type = question.media_type?.toLowerCase()

        if (type === 'image') {
            return (
                <div className={styles.mediaDisplay}>
                    <img src={question.media_url} alt="Question media" />
                </div>
            )
        }

        if (type === 'video') {
            return (
                <div className={styles.videoDisplay}>
                    <video
                        src={question.media_url}
                        controls
                        controlsList="nodownload"
                        className={styles.videoPlayer}
                    />
                </div>
            )
        }

        return null
    }

    const renderAnswer = (question) => {
        const type = question.question_type?.toLowerCase()
        const options = question.options || []
        const id = question.id

        switch (type) {
            case 'multiple_choice':
            case 'radio':
                return (
                    <div className={styles.optionsList}>
                        {options.map((opt, i) => {
                            const val = opt.id
                            const text = opt.option_text || opt.text || opt.value
                            return (
                                <label key={opt.id || i} className={styles.radioOption}>
                                    <input type="radio" name={id} value={val}
                                        checked={answers[id] === val}
                                        onChange={() => handleChange(id, val)} />
                                    <div className={`${styles.radioCircle} ${answers[id] === val ? styles.selected : ''}`}>
                                        {answers[id] === val && <div className={styles.radioInner} />}
                                    </div>
                                    <span>{text}</span>
                                </label>
                            )
                        })}
                        {question.has_other_option && (
                            <label className={styles.radioOption}>
                                <input type="radio" name={id} value="__other__"
                                    checked={answers[id] === '__other__'}
                                    onChange={() => handleChange(id, '__other__')} />
                                <div className={`${styles.radioCircle} ${answers[id] === '__other__' ? styles.selected : ''}`}>
                                    {answers[id] === '__other__' && <div className={styles.radioInner} />}
                                </div>
                                <span>Other</span>
                            </label>
                        )}
                    </div>
                )

            case 'short_answer':
            case 'text':
                return (
                    <div className={`${styles.textInput} ${errors[id] ? styles.inputError : ''}`}>
                        <input type="text" placeholder="Your answer"
                            value={answers[id] || ''}
                            onChange={(e) => handleChange(id, e.target.value)} />
                    </div>
                )

            case 'paragraph':
            case 'textarea':
                return (
                    <div className={`${styles.textInput} ${errors[id] ? styles.inputError : ''}`}>
                        <textarea placeholder="Your answer" rows={3}
                            value={answers[id] || ''}
                            onChange={(e) => handleChange(id, e.target.value)} />
                    </div>
                )

            case 'checkbox':
            case 'checkboxes':
                return (
                    <div className={styles.optionsList}>
                        {options.map((opt, i) => {
                            const val = opt.id
                            const text = opt.option_text || opt.text || opt.value
                            const checked = (answers[id] || []).includes(val)
                            return (
                                <label key={opt.id || i} className={styles.checkboxOption}>
                                    <input type="checkbox" checked={checked}
                                        onChange={(e) => handleCheckbox(id, val, e.target.checked)} />
                                    <div className={`${styles.checkboxSquare} ${checked ? styles.selected : ''}`}>
                                        {checked && (
                                            <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                                                <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                    <span>{text}</span>
                                </label>
                            )
                        })}
                        {question.has_other_option && (
                            <label className={styles.checkboxOption}>
                                <input type="checkbox"
                                    checked={(answers[id] || []).includes('__other__')}
                                    onChange={(e) => handleCheckbox(id, '__other__', e.target.checked)} />
                                <div className={`${styles.checkboxSquare} ${(answers[id] || []).includes('__other__') ? styles.selected : ''}`}>
                                    {(answers[id] || []).includes('__other__') && (
                                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                                            <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </div>
                                <span>Other</span>
                            </label>
                        )}
                    </div>
                )

            case 'dropdown':
            case 'select':
                return (
                    <div className={`${styles.dropdownInput} ${errors[id] ? styles.dropdownError : ''}`}>
                        <select value={answers[id] || ''}
                            onChange={(e) => handleChange(id, e.target.value)}>
                            <option value="">Dropdown</option>
                            {options.map((opt, i) => {
                                const val = opt.id
                                const text = opt.option_text || opt.text || opt.value
                                return <option key={opt.id || i} value={val}>{text}</option>
                            })}
                        </select>
                        <div className={styles.dropdownArrow}>
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                                <path d="M1 1L5 5L9 1" stroke="#3D3D3D" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                )

            default:
                return (
                    <div className={`${styles.textInput} ${errors[id] ? styles.inputError : ''}`}>
                        <input type="text" placeholder="Your answer"
                            value={answers[id] || ''}
                            onChange={(e) => handleChange(id, e.target.value)} />
                    </div>
                )
        }
    }

    return (
        <>
            <div className={styles.overlay}
                style={{ display: isStatusModalOpen ? 'none' : 'flex' }}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.drawerHeader}>
                            <div className={styles.title}>
                                <h2>Task Details</h2>
                            </div>
                            <button className={styles.closeBtn} onClick={onClose}>
                                <CloseIcon />
                            </button>
                        </div>
                        <div className={styles.divider} />
                    </div>

                    {/* Scrollable Content */}
                    <div className={styles.scrollContent}>
                        {/* Form Info Card */}
                        <div className={styles.formInfoCard}>
                            <div className={styles.titleDescContainer}>
                                <h3 className={styles.formTitle}>{surveyTitle}</h3>
                                <p className={styles.formDescription}>{surveyDescription}</p>
                            </div>
                            <div className={styles.formDivider} />
                            <p className={styles.requiredHint}>* indicates required questions</p>
                        </div>

                        {/* Question Cards */}
                        {questions.map((question, index) => (
                            <div key={question.id || index} className={`${styles.questionCard} ${errors[question.id] ? styles.questionCardError : ''}`}>
                                <div className={styles.questionHeader}>
                                    <span className={styles.questionText}>{question.question_text}</span>
                                    {question.is_required && <span className={styles.required}>*</span>}
                                </div>
                                {renderMedia(question)}
                                {renderAnswer(question)}
                                {errors[question.id] && (
                                    <p className={styles.errorMessage}>{errors[question.id]}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className={styles?.stickyFooter}>
                        <div className={styles.footerActions}>
                            <button className={styles.submitBtn}
                                onClick={handleSubmit}
                                disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                            <button className={styles.clearBtn} onClick={handleClear}>
                                Clear form
                            </button>
                        </div>

                        {/* Footer Branding */}
                        <div className={styles.footerBrand}>
                            <p className={styles.footerWarning}>Never share password through Forms.</p>
                            <div className={styles.footerLogo}>
                                <img src="/assets/icons/black-logo.svg" alt="CredBlaze" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <TaskStatusModal
                isOpen={isStatusModalOpen}
                onClose={() => {
                    setIsStatusModalOpen(false)
                    onClose()
                }}
                status={computedStatus}
                reward={computedReward}
                rewardType={computedRewardType}
                rejectionReason={task?.rejection_reason}
            />
        </>
    )
}