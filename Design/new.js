// 2FA Verification Phase
// <div className="space-y-8">
//   <div className="text-center lg:text-left">
//     <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600/10 rounded-full mb-4">
//       <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//       </svg>
//     </div>
//     <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Two-Step Verification</h2>
//     <p className="mt-2 text-gray-500 dark:text-gray-400 leading-relaxed">
//       We've sent a 6-digit verification code to your registered mobile number ending in{' '}
//       <span className="font-semibold text-gray-900 dark:text-gray-200">•••• 1234</span>
//     </p>
//   </div>

//   <div className="space-y-6">
//     <div className="flex justify-between gap-2 sm:gap-4">
//       {[0, 1, 2, 3, 4, 5].map((index) => (
//         <input
//           key={index}
//           className="w-full h-14 text-center text-2xl font-bold border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
//           maxLength={1}
//           type="text"
//           defaultValue={index < 2 ? (index === 0 ? '4' : '9') : ''}
//           placeholder={index >= 2 ? '•' : ''}
//         />
//       ))}
//     </div>

//     <div className="flex items-center justify-between">
//       <div className="flex items-center">
//         <input
//           className="h-4 w-4 text-blue-600 focus:ring-blue-600 border-gray-300 dark:border-gray-700 rounded transition-all"
//           id="trust-device"
//           type="checkbox"
//         />
//         <label className="ml-2 block text-sm text-gray-600 dark:text-gray-400" htmlFor="trust-device">
//           Trust this device
//         </label>
//       </div>
//       <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
//         Resend Code
//       </button>
//     </div>

//     <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-4 rounded-lg font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2">
//       Verify & Login
//       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//       </svg>
//     </button>

//     <button
//       onClick={() => setShowTFA(false)}
//       className="block w-full text-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
//     >
//       Back to Login
//     </button>
//   </div>

//   <div className="bg-blue-600/5 dark:bg-blue-600/10 p-4 rounded-xl border border-blue-600/10 mt-12">
//     <div className="flex gap-3">
//       <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//       </svg>
//       <div>
//         <h4 className="text-sm font-bold text-gray-900 dark:text-white">Having trouble?</h4>
//         <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
//           If you no longer have access to this phone number, please contact our support team at{' '}
//           <span className="text-blue-600 font-medium">1-800-MED-CORE</span> for identity verification.
//         </p>
//       </div>
//     </div>
//   </div>
// </div>