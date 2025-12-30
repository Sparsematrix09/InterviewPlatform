import React from 'react'
import toast from 'react-hot-toast'
import { ArrowRight, Video, Code2, Languages, Play, Users, Zap, Clock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { SignInButton, useUser } from '@clerk/clerk-react';

function AnimatedNumber({ end, duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
}

function ScrollAnimatedElement({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? 'animate-on-scroll' : 'opacity-0'}`}
      style={{
        animationDelay: isVisible ? `${delay}ms` : '0ms',
      }}
    >
      {children}
    </div>
  );
}

function Sparkles() {
  const sparkles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 3,
  }));

  return (
    <>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            animationDelay: `${sparkle.delay}s`,
          }}
        />
      ))}
    </>
  );
}

function App() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 rounded-lg shadow-lg">
                <Code2 className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Interveasy</h1>
                <p className="text-xs text-emerald-400 font-medium">Ace your technical interviews</p>
              </div>
            </div>

            <SignInButton mode="modal">
              <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer">
                {isSignedIn ? 'Dashboard' : 'Get Started'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </SignInButton>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <ScrollAnimatedElement>
              <h2 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                For real coders
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                  hiring seamlessly
                </span>
              </h2>
            </ScrollAnimatedElement>

            <ScrollAnimatedElement delay={100}>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                The ultimate platform for collaborative interviews. Connect in one-on-one sessions,
                code in realtime and ace your technical interviews.
              </p>
            </ScrollAnimatedElement>

            <ScrollAnimatedElement delay={200}>
              <div className="flex items-center justify-center gap-4">
                <SignInButton mode="modal">
                  <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 cursor-pointer">
                    {isSignedIn ? 'Go to Editor' : 'Start Coding'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </SignInButton>

                <button className="bg-gray-800 hover:bg-gray-700 text-gray-100 px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-gray-700 hover:border-emerald-500">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>
            </ScrollAnimatedElement>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <ScrollAnimatedElement delay={0}>
              <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group border border-emerald-800/50">
                <div className="bg-emerald-800/50 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Video className="w-7 h-7 text-emerald-300" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Live Video Chat</h3>
                <p className="text-emerald-200 leading-relaxed">
                  Crystal-clear video calls with your interviewer. Connect face-to-face for a personal touch.
                </p>
              </div>
            </ScrollAnimatedElement>

            <ScrollAnimatedElement delay={100}>
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group border border-gray-700">
                <div className="bg-emerald-900/30 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Code2 className="w-7 h-7 text-emerald-400" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Code Editor</h3>
                <p className="text-gray-300 leading-relaxed">
                  Powerful real-time code editor with syntax highlighting and intelligent autocomplete.
                </p>
              </div>
            </ScrollAnimatedElement>

            <ScrollAnimatedElement delay={200}>
              <div className="bg-gradient-to-br from-teal-900 via-emerald-900 to-emerald-900 p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group border border-emerald-800/50">
                <div className="bg-emerald-800/50 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Languages className="w-7 h-7 text-emerald-300" strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Multiple Languages</h3>
                <p className="text-emerald-200 leading-relaxed">
                  Support for JavaScript, Python, Java, C++ and more. Code in your preferred language.
                </p>
              </div>
            </ScrollAnimatedElement>
          </div>

          <ScrollAnimatedElement className="mt-24 mb-24">
            <div className="relative rounded-3xl overflow-hidden bg-gray-900 border border-emerald-800/30 p-16">
              <Sparkles />
              <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl -z-10"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-900/20 rounded-full blur-3xl -z-10"></div>

              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <h2 className="text-5xl font-bold text-white mb-6">Ready to revolutionize your interviews?</h2>
                <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                  Join thousands of developers and companies who are already transforming their hiring process with Interveasy. Experience seamless collaboration and ace your technical interviews.
                </p>
                <SignInButton mode="modal">
                  <button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 mx-auto cursor-pointer">
                    {isSignedIn ? 'Continue to Dashboard' : 'Start Your Journey'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </SignInButton>
              </div>
            </div>
          </ScrollAnimatedElement>

          <div className="mt-24 mb-24">
            <div className="relative bg-gray-900/50 rounded-3xl border-2 border-emerald-900/30 p-12 overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-900/10 rounded-full blur-3xl -z-10"></div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <ScrollAnimatedElement className="animate-slide-left">
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-6">Trusted by developers worldwide</h2>
                    <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                      Interveasy has transformed how companies conduct technical interviews. Join thousands of developers and companies already using our platform.
                    </p>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 p-2 bg-emerald-900/40 rounded-lg">
                          <Zap className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white mb-1">Real-time collaboration</h3>
                          <p className="text-gray-400">Code together seamlessly with zero latency</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="mt-1 p-2 bg-emerald-900/40 rounded-lg">
                          <Users className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white mb-1">Secure interviews</h3>
                          <p className="text-gray-400">Enterprise-grade security and privacy controls</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="mt-1 p-2 bg-emerald-900/40 rounded-lg">
                          <Clock className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white mb-1">Always available</h3>
                          <p className="text-gray-400">99.9% uptime guarantee for your interviews</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollAnimatedElement>

                <ScrollAnimatedElement className="animate-slide-right">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-900/20 rounded-2xl blur-2xl"></div>
                    <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-emerald-900/30 shadow-2xl">
                      <div className="grid grid-cols-1 gap-6">
                        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-800/30">
                          <div className="text-4xl font-bold text-emerald-300 mb-2">
                            <AnimatedNumber end={45000} />
                            <span>+</span>
                          </div>
                          <p className="text-gray-100 font-semibold">Active Users</p>
                          <p className="text-sm text-gray-400 mt-1">Growing daily</p>
                        </div>

                        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
                          <div className="text-4xl font-bold text-emerald-400 mb-2">
                            <AnimatedNumber end={128000} />
                            <span>+</span>
                          </div>
                          <p className="text-white font-semibold">Sessions Completed</p>
                          <p className="text-sm text-gray-400 mt-1">All time record</p>
                        </div>

                        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-emerald-900/40 to-emerald-800/40 border border-emerald-800/30">
                          <div className="text-4xl font-bold text-emerald-300 mb-2">
                            99.<span className="text-3xl">9</span>%
                          </div>
                          <p className="text-gray-100 font-semibold">Uptime</p>
                          <p className="text-sm text-gray-400 mt-1">Reliable platform</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollAnimatedElement>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;