import React from 'react';

interface TimelineItem {
    year: string;
    event: string;
    completed?: boolean;
}

interface TimelineProps {
    items?: TimelineItem[];
}

export const Timeline: React.FC<TimelineProps> = ({
    items = [
        { year: '1984', event: 'First Macintosh computer', completed: true },
        { year: '1998', event: 'iMac', completed: true },
        { year: '2001', event: 'iPod', completed: true },
        { year: '2007', event: 'iPhone', completed: false },
        { year: '2015', event: 'Apple Watch', completed: false },
    ]
}) => {
    return (
        <div className="flex justify-center w-full overflow-x-auto pb-4">
            <ul className="timeline timeline-vertical lg:timeline-horizontal mx-auto max-w-4xl">
                {items.map((item, index) => (
                    <li key={index} className="timeline-item group">
                        {index > 0 && <hr className={item.completed ? "bg-monad-purple" : "bg-monad-purple/30"} />}

                        <div className="timeline-middle transition-transform duration-200 group-hover:scale-125">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill={item.completed ? "#836EF9" : "#d1d1d1"}
                                className="h-5 w-5">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                    clipRule="evenodd" />
                            </svg>
                        </div>

                        <div className={`${index % 2 === 0 ? 'timeline-start' : 'timeline-end'} bg-white/80 text-black font-medium p-3 rounded-md lg:min-w-[120px] shadow-sm hover:shadow-md transform transition-all duration-200 hover:scale-105 hover:bg-white hover:-translate-y-1`}>
                            {item.event}
                            <div className="text-xs mt-1 text-monad-berry font-bold">{item.year}</div>
                        </div>

                        {index < items.length - 1 && <hr className={item.completed ? "bg-monad-purple" : "bg-monad-purple/30"} />}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Timeline;
