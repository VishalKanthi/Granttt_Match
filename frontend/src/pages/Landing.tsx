import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Zap, BarChart3, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <section className="pt-10 md:pt-20 text-center space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20"
                >
                    🚀 AI-Powered Grant Matching is Here
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl font-extrabold tracking-tight lg:text-6xl max-w-4xl mx-auto"
                >
                    Stop Missing Grants. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Start Winning Them.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl text-muted-foreground max-w-2xl mx-auto"
                >
                    Our AI analyzes 500+ grants in seconds to find your perfect match—and tells you exactly how to win them.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
                >
                    <Link to="/profile">
                        <button className="h-11 px-8 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 flex items-center justify-center gap-2 w-full sm:w-auto">
                            Get Matched in 3 Minutes <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                    <a href="#how-it-works">
                        <button className="h-11 px-8 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors w-full sm:w-auto">
                            See How It Works
                        </button>
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="pt-8 text-sm text-slate-500"
                >
                    ✨ Matched 1,247 startups with $18.2M in grants this month
                </motion.div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">How GrantMatch AI Works</h2>
                    <p className="text-muted-foreground">From discovery to application in four simple steps.</p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-4 gap-8"
                >
                    {[
                        {
                            icon: <User className="w-6 h-6 text-blue-600" />,
                            title: "1. Build Profile",
                            desc: "Complete our smart 2-minute form to define your startup's DNA."
                        },
                        {
                            icon: <Search className="w-6 h-6 text-purple-600" />,
                            title: "2. AI Analysis",
                            desc: "Our engine scans 500+ grants to find semantic & eligibility matches."
                        },
                        {
                            icon: <Zap className="w-6 h-6 text-yellow-600" />,
                            title: "3. Get Matches",
                            desc: "See your top matches scored by probability of winning."
                        },
                        {
                            icon: <BarChart3 className="w-6 h-6 text-green-600" />,
                            title: "4. Win Grants",
                            desc: "Get AI-generated application tips and readiness scoring."
                        }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="mb-4 bg-slate-50 w-12 h-12 rounded-lg flex items-center justify-center">
                                {item.icon}
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="bg-slate-900 text-white py-16 rounded-3xl mx-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold mb-2">$50B+</div>
                            <div className="text-slate-400">Unclaimed Grants Annually</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">500+</div>
                            <div className="text-slate-400">Grants in Database</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">2.5s</div>
                            <div className="text-slate-400">Matching Speed</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="text-center py-10">
                <h2 className="text-3xl font-bold mb-6">Ready to find your funding?</h2>
                <Link to="/profile">
                    <button className="h-12 px-8 rounded-full bg-primary text-white text-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-xl shadow-primary/20">
                        Start Your Free Search Now
                    </button>
                </Link>
            </section>
        </div>
    );
};

export default Landing;
