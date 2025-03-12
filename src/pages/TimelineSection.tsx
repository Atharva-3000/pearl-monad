'use client';
import Timeline from '@/components/Timeline';
import React from 'react';

export default function TimelineSection() {
    // Custom timeline items related to blockchain/Monad
    const timelineItems = [
        { year: 'Mar `25', event: 'MVP Launches', completed: true },
        { year: 'APR `25', event: 'SDK Dev launch', completed: false },
        { year: 'APR `25', event: 'New Tools Added', completed: false },
        { year: 'May `25', event: 'Ecosystem Integration', completed: false },
    ];

    return (
        <div id="roadmap" className="min-h-[70vh] bg-pattern w-full py-12">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h3 className="text-4xl font-bold text-monad-purple">Roadmap</h3>
                </div>

                <div className="bg-[#f5f5f4] rounded-2xl p-6 md:p-10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12),_0_0_0_1px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.15),_0_0_0_1px_rgba(0,0,0,0.1)] transition-all duration-500">
                    <div className="flex justify-center w-full">
                        <div className="w-full text-center">
                            <p className="text-center text-lg text-black/70 mb-12">
                                What&apos;s Next for P.E.A.R.L. Labs powered by MONAD?
                            </p>

                            <Timeline items={timelineItems} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}