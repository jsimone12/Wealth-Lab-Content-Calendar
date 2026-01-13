import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, Lightbulb, Heart, Laugh } from 'lucide-react';

export default function ContentCalendarGenerator() {
  const [step, setStep] = useState('welcome');
  const [userInfo, setUserInfo] = useState({ fname: '', lname: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({
    q1: '',
    q2: [],
    q3: '',
    q4: '',
    q5: '',
    q6: [],
    q7: ''
  });
  const [contentCalendar, setContentCalendar] = useState('');

  useEffect(() => {
    const link1 = document.createElement('link');
    link1.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@600&family=DM+Sans:wght@400;500&family=Playfair+Display:ital@1&display=swap';
    link1.rel = 'stylesheet';
    document.head.appendChild(link1);
    
    const params = new URLSearchParams(window.location.search);
    setUserInfo({
      fname: params.get('fname') || '',
      lname: params.get('lname') || '',
      email: params.get('email') || '',
      phone: params.get('phone') || ''
    });
  }, []);

  const handleAnswerChange = (question, value) => {
    setAnswers(prev => ({ ...prev, [question]: value }));
  };

  const handleCheckboxChange = (question, value, maxSelections = null) => {
    setAnswers(prev => {
      const current = prev[question] || [];
      
      if (current.includes(value)) {
        return { ...prev, [question]: current.filter(item => item !== value) };
      } else {
        if (maxSelections && current.length >= maxSelections) {
          return prev;
        }
        return { ...prev, [question]: [...current, value] };
      }
    });
  };

  const generateCalendar = async () => {
    setLoading(true);
    setStep('loading');

    try {
      const quarters = [
        { start: 1, end: 13, focus: 'Building connection and trust (mix of relatable + inspirational + some educational)' },
        { start: 14, end: 26, focus: 'Establishing credibility and expertise (heavier educational + inspirational)' },
        { start: 27, end: 39, focus: 'Deepening engagement (all pillars balanced, introducing more entertaining)' },
        { start: 40, end: 52, focus: 'Positioning as the go-to expert (strategic mix of all four pillars)' }
      ];

      let fullCalendar = '';

      for (const quarter of quarters) {
        const prompt = `You are an expert content strategist helping early-stage entrepreneurs build influence through consistent, strategic content creation.

CLIENT PROFILE:
- Name: ${userInfo.fname} ${userInfo.lname}
- Problem they solve & for whom: ${answers.q1}
- Platforms focusing on: ${answers.q2.join(', ')}
- Content skill level: ${answers.q3}
- Client transformation: ${answers.q4}
- What makes them unique: ${answers.q5}
- Topics they're confident about: ${answers.q6.join(', ')}
- Biggest content challenge: ${answers.q7}

Generate weeks ${quarter.start}-${quarter.end} of a 52-week content calendar.

CONTENT PILLARS (balance evenly across these 13 weeks):
- Educational (teaches something valuable)
- Inspirational (motivates and uplifts)
- Relatable (shares struggles, real moments)
- Entertaining (engages and delights)

FOCUS FOR WEEKS ${quarter.start}-${quarter.end}: ${quarter.focus}

FORMAT FOR EACH WEEK:

**Week [X]: [CONTENT PILLAR]**
**Platform:** [One of: ${answers.q2.join(', ')}]
**Format:** [Specific to platform - e.g., Instagram Reel, LinkedIn carousel, TikTok video, YouTube Short, etc.]
**Content Hook/Template:** [Flexible template they can customize]
**Why It Works:** [1 sentence on strategic value]

---

GUIDELINES:
- Adjust complexity for skill level: ${answers.q3}
- Reference their unique story: ${answers.q5}
${quarter.start <= 7 ? `- Address their challenge (${answers.q7}) in week ${quarter.start + 4}-${quarter.start + 6}` : ''}
- Speak to ideal client transformation: ${answers.q4}
- Mix familiar topics (${answers.q6.join(', ')}) with growth-edge content
- Rotate through platforms strategically
- Tone: Empowering, actionable, encourages consistency over perfection

Generate all 13 weeks (${quarter.start}-${quarter.end}) now.`;

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });

        const data = await response.json();
        fullCalendar += data.ideas + '\n\n';
      }

      setContentCalendar(fullCalendar);
      setStep('results');
    } catch (error) {
      console.error('Error generating calendar:', error);
      alert('Something went wrong. Please try again.');
      setStep('questions');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    return answers.q1 && answers.q2.length > 0 && answers.q2.length <= 3 && 
           answers.q3 && answers.q4 && answers.q5 && 
           answers.q6.length > 0 && answers.q7;
  };

  if (step === 'welcome') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #FDF9ED, #f5f0e0, #FDF9ED)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <style jsx global>{`
          body { margin: 0; padding: 0; }
        `}</style>
        <div style={{
          maxWidth: '672px',
          width: '100%',
          backgroundColor: '#0A1F33',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          padding: '48px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <Calendar style={{ width: '64px', height: '64px', color: '#C8A15A' }} />
          </div>
          <h1 style={{
            fontSize: '36px',
            color: '#FDF9ED',
            textAlign: 'center',
            marginBottom: '16px',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600
          }}>
            Welcome{userInfo.fname && `, ${userInfo.fname}`}!
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#FDF9ED',
            textAlign: 'center',
            marginBottom: '32px',
            fontFamily: 'DM Sans, sans-serif'
          }}>
            You're about to receive your personalized 52-week content calendar designed to help you build influence, grow your audience, and stay consistent with content creation.
          </p>
          <div style={{
            backgroundColor: 'rgba(183, 199, 179, 0.3)',
            borderLeft: '4px solid #C8A15A',
            padding: '24px',
            marginBottom: '32px'
          }}>
            <p style={{
              color: '#FDF9ED',
              fontWeight: 500,
              margin: 0,
              fontFamily: 'DM Sans, sans-serif'
            }}>
              This will take about 5-7 minutes. Answer honestly — the more specific you are, the more tailored your content calendar will be to your unique journey.
            </p>
          </div>
          <button
            onClick={() => setStep('questions')}
            style={{
              width: '100%',
              backgroundColor: '#C8A15A',
              color: '#0A1F33',
              fontWeight: 600,
              padding: '16px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Montserrat, sans-serif',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#B8915A'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#C8A15A'}
          >
            Let's Build Your Calendar
            <Calendar style={{ marginLeft: '8px', width: '20px', height: '20px' }} />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'questions') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #FDF9ED, #f5f0e0, #FDF9ED)',
        padding: '48px 24px'
      }}>
        <style jsx global>{`
          body { margin: 0; padding: 0; }
        `}</style>
        <div style={{
          maxWidth: '768px',
          margin: '0 auto',
          backgroundColor: '#0A1F33',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          padding: '48px'
        }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              color: '#FDF9ED',
              fontSize: '30px',
              marginBottom: '8px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600
            }}>
              Your Content Strategy Questionnaire
            </h2>
            <p style={{
              color: '#FDF9ED',
              opacity: 0.8,
              fontFamily: 'DM Sans, sans-serif'
            }}>
              Answer these 7 questions to unlock your personalized 52-week content calendar
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ borderBottom: '1px solid #B7C7B3', paddingBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '18px',
                fontWeight: 500,
                color: '#FDF9ED',
                marginBottom: '12px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                1. What problem do you solve, and for whom?
              </label>
              <textarea
                value={answers.q1}
                onChange={(e) => handleAnswerChange('q1', e.target.value)}
                style={{
                  width: '100%',
                  border: '2px solid #B7C7B3',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#FDF9ED',
                  color: '#0A1F33',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '16px'
                }}
                rows="4"
                placeholder="Example: I help burned-out corporate professionals transition to entrepreneurship"
              />
            </div>

            <div style={{ borderBottom: '1px solid #B7C7B3', paddingBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '18px',
                fontWeight: 500,
                color: '#FDF9ED',
                marginBottom: '12px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                2. Which platforms are you focusing on for your content? (Select up to 3)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'TikTok',
                  'Instagram',
                  'YouTube',
                  'LinkedIn',
                  'Facebook',
                  'Twitter/X',
                  'Substack'
                ].map((platform, idx) => (
                  <label key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    color: '#FDF9ED',
                    fontFamily: 'DM Sans, sans-serif',
                    opacity: answers.q2.length >= 3 && !answers.q2.includes(platform) ? 0.5 : 1
                  }}>
                    <input
                      type="checkbox"
                      checked={answers.q2.includes(platform)}
                      onChange={() => handleCheckboxChange('q2', platform, 3)}
                      disabled={answers.q2.length >= 3 && !answers.q2.includes(platform)}
                      style={{ width: '20px', height: '20px', accentColor: '#C8A15A' }}
                    />
                    <span>{platform}</span>
                  </label>
                ))}
              </div>
              {answers.q2.length >= 3 && (
                <p style={{
                  color: '#C8A15A',
                  fontSize: '14px',
                  marginTop: '8px',
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                  You've selected 3 platforms (maximum reached)
                </p>
              )}
            </div>

            <div style={{ borderBottom: '1px solid #B7C7B3', paddingBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '18px',
                fontWeight: 500,
                color: '#FDF9ED',
                marginBottom: '12px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                3. How would you describe your current content creation skill level?
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { value: 'Just getting started', label: 'Just getting started (never posted or rarely post)' },
                  { value: 'Beginner', label: 'Beginner (post occasionally but inconsistently)' },
                  { value: 'Intermediate', label: 'Intermediate (post regularly but want to improve strategy)' },
                  { value: 'Advanced', label: 'Advanced (confident creator looking to optimize)' }
                ].map(option => (
                  <label key={option.value} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    color: '#FDF9ED',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    <input
                      type="radio"
                      name="q3"
                      value={option.value}
                      checked={answers.q3 === option.value}
                      onChange={(e) => handleAnswerChange('q3', e.target.value)}
                      style={{ width: '20px', height: '20px', accentColor: '#C8A15A' }}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ borderBottom: '1px solid #B7C7B3', paddingBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '18px',
                fontWeight: 500,
                color: '#FDF9ED',
                marginBottom: '12px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                4. What's the main transformation your ideal client wants to achieve?
              </label>
              <textarea
                value={answers.q4}
                onChange={(e) => handleAnswerChange('q4', e.target.value)}
                style={{
                  width: '100%',
                  border: '2px solid #B7C7B3',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#FDF9ED',
                  color: '#0A1F33',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '16px'
                }}
                rows="4"
                placeholder="Example: Go from feeling trapped in a 9-5 to running a 6-figure business with freedom and flexibility"
              />
            </div>

            <div style={{ borderBottom: '1px solid #B7C7B3', paddingBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '18px',
                fontWeight: 500,
                color: '#FDF9ED',
                marginBottom: '12px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                5. What makes YOUR approach or story unique? What sets you apart?
              </label>
              <textarea
                value={answers.q5}
                onChange={(e) => handleAnswerChange('q5', e.target.value)}
                style={{
                  width: '100%',
                  border: '2px solid #B7C7B3',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#FDF9ED',
                  color: '#0A1F33',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '16px'
                }}
                rows="4"
                placeholder="Example: I've left corporate 3 times and built multiple 6-figure businesses as a Black woman"
              />
            </div>

            <div style={{ borderBottom: '1px solid #B7C7B3', paddingBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '18px',
                fontWeight: 500,
                color: '#FDF9ED',
                marginBottom: '12px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                6. What topics do you feel most confident talking about? (Select all that apply)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'My personal story/journey',
                  'Overcoming obstacles/challenges',
                  'Step-by-step how-tos and tutorials',
                  'Industry trends and insights',
                  'Mindset and motivation',
                  'Behind-the-scenes of my business/life',
                  'Client success stories and results',
                  'Controversial or hot takes in my niche'
                ].map((topic, idx) => (
                  <label key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    cursor: 'pointer',
                    color: '#FDF9ED',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    <input
                      type="checkbox"
                      checked={answers.q6.includes(topic)}
                      onChange={() => handleCheckboxChange('q6', topic)}
                      style={{ width: '20px', height: '20px', marginTop: '4px', accentColor: '#C8A15A' }}
                    />
                    <span>{topic}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ paddingBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '18px',
                fontWeight: 500,
                color: '#FDF9ED',
                marginBottom: '12px',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                7. What's your biggest fear or challenge when it comes to creating content consistently?
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  "I don't know what to post about",
                  "I'm afraid of judgment or negative comments",
                  "I don't have enough time",
                  "I feel like I'm not an expert yet",
                  "I run out of ideas quickly",
                  "I don't know how to make content engaging"
                ].map((challenge, idx) => (
                  <label key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    cursor: 'pointer',
                    color: '#FDF9ED',
                    fontFamily: 'DM Sans, sans-serif'
                  }}>
                    <input
                      type="radio"
                      name="q7"
                      value={challenge}
                      checked={answers.q7 === challenge}
                      onChange={(e) => handleAnswerChange('q7', e.target.value)}
                      style={{ width: '20px', height: '20px', marginTop: '4px', accentColor: '#C8A15A' }}
                    />
                    <span>{challenge}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={generateCalendar}
            disabled={!canProceed()}
            style={{
              width: '100%',
              fontWeight: 600,
              padding: '16px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '18px',
              marginTop: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canProceed() ? 'pointer' : 'not-allowed',
              backgroundColor: canProceed() ? '#C8A15A' : '#ccc',
              color: canProceed() ? '#0A1F33' : '#666',
              fontFamily: 'Montserrat, sans-serif',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => canProceed() && (e.target.style.backgroundColor = '#B8915A')}
            onMouseOut={(e) => canProceed() && (e.target.style.backgroundColor = '#C8A15A')}
          >
            <Sparkles style={{ marginRight: '8px', width: '20px', height: '20px' }} />
            Generate My 52-Week Calendar
          </button>
        </div>
      </div>
    );
  }

  if (step === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #FDF9ED, #f5f0e0, #FDF9ED)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <style jsx global>{`
          body { margin: 0; padding: 0; }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div style={{
          maxWidth: '672px',
          width: '100%',
          backgroundColor: '#0A1F33',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          padding: '48px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{ animation: 'spin 1s linear infinite' }}>
              <Calendar style={{ width: '64px', height: '64px', color: '#C8A15A' }} />
            </div>
          </div>
          <h2 style={{
            fontSize: '30px',
            color: '#FDF9ED',
            marginBottom: '16px',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600
          }}>
            Crafting Your Personalized Content Calendar...
          </h2>
          <p style={{
            color: '#FDF9ED',
            opacity: 0.9,
            fontSize: '18px',
            marginBottom: '16px',
            fontFamily: 'DM Sans, sans-serif'
          }}>
            Our AI is analyzing your answers and building your custom 52-week content strategy.
          </p>
          <p style={{
            color: '#C8A15A',
            fontSize: '16px',
            fontStyle: 'italic',
            marginBottom: '32px',
            fontFamily: 'Playfair Display, serif'
          }}>
            Great things take time. This could take 1-3 minutes — hang tight, it'll be worth the wait!
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              color: '#C8A15A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              <Lightbulb style={{ width: '20px', height: '20px', marginRight: '8px' }} />
              <span>Mapping your unique voice and expertise...</span>
            </div>
            <div style={{
              color: '#C8A15A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              <Heart style={{ width: '20px', height: '20px', marginRight: '8px' }} />
              <span>Designing content that builds authentic connection...</span>
            </div>
            <div style={{
              color: '#C8A15A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              <Laugh style={{ width: '20px', height: '20px', marginRight: '8px' }} />
              <span>Creating your year-long influence strategy...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #FDF9ED, #f5f0e0, #FDF9ED)',
        padding: '48px 24px'
      }}>
        <style jsx global>{`
          body { margin: 0; padding: 0; }
        `}</style>
        <div style={{
          maxWidth: '896px',
          margin: '0 auto',
          backgroundColor: '#0A1F33',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          padding: '48px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <Calendar style={{ width: '64px', height: '64px', color: '#C8A15A' }} />
          </div>
          <h1 style={{
            fontSize: '36px',
            color: '#FDF9ED',
            textAlign: 'center',
            marginBottom: '16px',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600
          }}>
            Your 52-Week Content Calendar, {userInfo.fname}!
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#FDF9ED',
            opacity: 0.8,
            textAlign: 'center',
            marginBottom: '48px',
            fontFamily: 'DM Sans, sans-serif'
          }}>
            Here's your personalized content strategy designed to help you build influence and stay consistent all year long.
          </p>
          
          <div style={{
            color: '#FDF9ED',
            lineHeight: '1.8',
            whiteSpace: 'pre-wrap',
            fontFamily: 'DM Sans, sans-serif'
          }}>
            {contentCalendar.split('\n').map((line, idx) => {
              if (line.startsWith('**Week')) {
                return <h3 key={idx} style={{
                  fontSize: '20px',
                  color: '#C8A15A',
                  marginTop: '32px',
                  marginBottom: '12px',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600
                }}>{line.replace(/\*\*/g, '')}</h3>;
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                return <h4 key={idx} style={{
                  fontSize: '16px',
                  color: '#FDF9ED',
                  marginTop: '16px',
                  marginBottom: '8px',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600
                }}>{line.replace(/\*\*/g, '')}</h4>;
              }
              if (line.trim() === '---') {
                return <hr key={idx} style={{
                  margin: '32px 0',
                  border: 'none',
                  borderTop: '1px solid #B7C7B3'
                }} />;
              }
              if (line.startsWith('*') && line.endsWith('*')) {
                return <p key={idx} style={{
                  color: '#FDF9ED',
                  fontSize: '16px',
                  marginBottom: '16px',
                  fontFamily: 'Playfair Display, serif',
                  fontStyle: 'italic'
                }}>{line.replace(/\*/g, '')}</p>;
              }
              return <p key={idx} style={{ marginBottom: '8px', fontSize: '15px' }}>{line}</p>;
            })}
          </div>

          <div style={{
            marginTop: '48px',
            backgroundColor: 'rgba(183, 199, 179, 0.3)',
            border: '2px solid #C8A15A',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '24px',
              color: '#FDF9ED',
              marginBottom: '16px',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600
            }}>
              Ready to Execute Your Strategy?
            </h3>
            <p style={{
              color: '#FDF9ED',
              fontSize: '18px',
              marginBottom: '24px',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              Book your free 30-minute strategy call and let's turn this calendar into your content creation system.
            </p>
            <a
              href="https://calendly.com/jsimonesolutions/content-calendar-conversations"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                backgroundColor: '#C8A15A',
                color: '#0A1F33',
                fontWeight: 600,
                padding: '16px 32px',
                borderRadius: '8px',
                fontSize: '18px',
                textDecoration: 'none',
                fontFamily: 'Montserrat, sans-serif',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#B8915A'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#C8A15A'}
            >
              Book Your Strategy Call Now
            </a>
          </div>
        </div>
      </div>
    );
  }

  return null;
}