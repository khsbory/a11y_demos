import React from 'react';
import PageTitle from '@/components/PageTitle';

const ImageContainerFocusPage = () => {
    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="mb-6">
                <PageTitle>Image Container Focus</PageTitle>
                <p className="text-slate-600 mt-2">
                    Compare accessibility behavior between a focusable image container and a non-focusable one.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-12">
                {/* Case 1: Container with tabIndex="0" */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold border-b pb-2">Case 1: Container with tabIndex="0"</h2>
                    <div
                        tabIndex={0}
                        className="border-2 border-slate-300 p-4 rounded-xl hover:border-blue-400 focus:ring-4 focus:ring-blue-500 focus:outline-none transition-all cursor-pointer"
                        aria-label="Coupon Notice Container"
                    >
                        <img
                            src="/images/coupon-notice.png"
                            alt="COUPON NOTICE - Nano Banana. 1. This coupon can only be used within the validity period, and will automatically expire and cannot be reissued or restored after the period has ended. 2. Cannot be used with other discount offers or event coupons, and only one coupon can be selected per transaction. 3. If you cancel or refund items purchased with the coupon, the reusability of the used coupon may be restricted according to regulations."
                            className="w-full h-auto rounded-lg shadow-md"
                        />
                    </div>
                </section>

                {/* Case 2: Container without tabIndex */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold border-b pb-2">Case 2: Container without tabIndex</h2>
                    <div className="border-2 border-slate-300 p-4 rounded-xl hover:border-blue-400 transition-all">
                        <img
                            src="/images/coupon-notice.png"
                            alt="COUPON NOTICE - Nano Banana. 1. This coupon can only be used within the validity period, and will automatically expire and cannot be reissued or restored after the period has ended. 2. Cannot be used with other discount offers or event coupons, and only one coupon can be selected per transaction. 3. If you cancel or refund items purchased with the coupon, the reusability of the used coupon may be restricted according to regulations."
                            className="w-full h-auto rounded-lg shadow-md"
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ImageContainerFocusPage;
