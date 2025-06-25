const TermsModal = ({ onClose }) => {
    const terms = [
        { title: "Service Authorization", content: "By signing up, you authorize MotoFix to perform the requested services on your two-wheeler." },
        { title: "Payment", content: "Full payment is due upon completion of services. Your vehicle will be released only after full payment." },
        { title: "Parts", content: "We use both OEM and high-quality aftermarket parts. All parts remain the property of MotoFix until paid in full." },
        { title: "Liability", content: "MotoFix is not responsible for personal items left in the vehicle or pre-existing damage." },
        { title: "Vehicle Storage", content: "A storage fee may be applied if your vehicle is not collected within 48 hours of service completion." },
        { title: "Warranty", content: "We offer a 30-day or 1000 km warranty on specific repairs performed." },
        { title: "Data Privacy", content: "Your personal information is collected for service and communication purposes only." }
    ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-11/12 max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 scale-95 animate-modal-pop">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">MotoFix - Terms & Conditions</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Close">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>
                <div className="p-6 overflow-y-auto">
                    <ol className="space-y-5 text-gray-600 dark:text-gray-300 list-decimal list-inside text-base">
                        {terms.map((term, index) => (
                            <li key={index} className="pl-2 leading-relaxed">
                                <span className="font-bold text-gray-800 dark:text-white">{term.title}:</span>{' '}
                                {term.content}
                            </li>
                        ))}
                    </ol>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 text-right">
                    <button onClick={onClose} className="bg-blue-600 text-white font-bold rounded-lg px-6 py-2.5 text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl">
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;