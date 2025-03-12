import { X } from 'lucide-react';
import { motion } from 'framer-motion';

type MenuOverlayProps = {
    isOpen: boolean;
    onClose: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
    // Added "Roadmap" to the navigation links, right before "Footer"
    const links = ['Home', 'Features', 'Why', 'Tools', 'Roadmap', 'Footer'];

    const overlayVariants = {
        hidden: { y: "-100%" },
        visible: { y: "0%" },
        exit: { y: "-100%" }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 left-0 w-full h-full z-50"
        >
            <div className="absolute inset-0 bg-monad-berry backdrop-blur-xl">
                <motion.button
                    onClick={onClose}
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    exit={{ rotate: -360 }}
                    transition={{ duration: 0.5, ease: "linear" }}
                    className="absolute top-8 right-8 p-2"
                >
                    <X className="w-8 h-8 text-monad-offwhite" />
                </motion.button>

                <div className="flex flex-col items-center justify-center h-full gap-8">
                    {links.map((link) => (
                        <a
                            key={link}
                            href={`#${link.toLowerCase()}`}
                            onClick={(e) => {
                                e.preventDefault();
                                onClose();
                                const element = document.getElementById(link.toLowerCase());
                                element?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            }}
                            className="relative text-4xl font-bold text-monad-offwhite transition-transform duration-300 transform hover:scale-110 group"
                        >
                            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative group-hover:text-black">{link}</span>
                        </a>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}