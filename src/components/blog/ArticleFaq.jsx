import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FaqItem = ({ question, answer, defaultOpen = false }) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <button
                type="button"
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
            >
                <span>{question}</span>
                <ChevronDown
                    size={20}
                    className={`shrink-0 text-primary transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open && (
                <div className="px-5 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {answer}
                </div>
            )}
        </div>
    );
};

const ArticleFaq = ({ faqs }) => {
    const items = (faqs || []).filter((f) => f.question?.trim() && f.answer?.trim());
    if (!items.length) return null;

    return (
        <section className="mt-12 pt-10 border-t border-gray-100" aria-labelledby="article-faq-heading">
            <h2 id="article-faq-heading" className="text-2xl font-bold text-gray-900 mb-6">
                Câu hỏi thường gặp
            </h2>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <FaqItem
                        key={`${item.question}-${index}`}
                        question={item.question.trim()}
                        answer={item.answer.trim()}
                        defaultOpen={index === 0}
                    />
                ))}
            </div>
        </section>
    );
};

export default ArticleFaq;
