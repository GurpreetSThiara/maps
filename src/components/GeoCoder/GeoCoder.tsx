/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback } from 'react';
import { AddressAutofill, AddressMinimap, useConfirmAddress } from '@mapbox/search-js-react';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibG92ZXJvc2UxMjM0NSIsImEiOiJjbTNzb2dxZDIwMGpvMmtzY3dmdWN1bTZwIn0.yV8rSqXjiW2Tqzo6Rk01kw';

const AddressForm: React.FC = () => {
  const [activePage, setActivePage] = useState<'shipping' | 'confirm' | 'complete'>('shipping');
  const [formData, setFormData] = useState<FormData | null>(null);
  const [minimapFeature, setMinimapFeature] = useState<any | null>(null);
  const { formRef, showConfirm } = useConfirmAddress({ accessToken: MAPBOX_ACCESS_TOKEN });

  const handleAutofillRetrieve = (response: any) => {
    setMinimapFeature(response.features[0]);
  };

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const result = await showConfirm();
      if (result.type === 'nochange') {
        setFormData(new FormData(e.currentTarget));
        setActivePage('confirm');
      }
    },
    [showConfirm]
  );

  const handleTryAgain = () => {
    formRef.current?.reset();
    setMinimapFeature(null);
    setActivePage('shipping');
  };

  const displayAddress = formData ? (
    <>
      <p>
        {formData.get('first-name')?.toString()} {formData.get('last-name')?.toString()}
      </p>
      <p>{formData.get('address-line1')?.toString()}</p>
      <p>{formData.get('address-line2')?.toString() || ''}</p>
      <p>
        {formData.get('address-level2')?.toString()}, {formData.get('address-level1')?.toString()} {formData.get('postal-code')?.toString()}
      </p>
    </>
  ) : null;

  return (
    <div className="max-w-2xl p-6 mx-auto mt-10 bg-white rounded-lg shadow-lg">
      {activePage === 'shipping' && (
        <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Shipping Address</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
                <input
                  type="text"
                  name="first-name"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
                <input
                  type="text"
                  name="last-name"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </label>
            </div>
          </div>
          <AddressAutofill accessToken={MAPBOX_ACCESS_TOKEN} onRetrieve={handleAutofillRetrieve}>
            <label className="block text-sm font-medium text-gray-700">
              Address
              <input
                type="text"
                name="address-line1"
                autoComplete="address-line1"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </label>
          </AddressAutofill>
          <label className="block text-sm font-medium text-gray-700">
            Apartment, Suite, etc. (optional)
            <input
              type="text"
              name="address-line2"
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="block text-sm font-medium text-gray-700">
              City
              <input
                type="text"
                name="address-level2"
                autoComplete="address-level2"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              State
              <input
                type="text"
                name="address-level1"
                autoComplete="address-level1"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              ZIP Code
              <input
                type="text"
                name="postal-code"
                autoComplete="postal-code"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </label>
          </div>
          {minimapFeature && (
            <div className="h-48 mt-4 overflow-hidden border border-gray-300 rounded-lg">
              <AddressMinimap
                feature={minimapFeature}
                show
                satelliteToggle
                canAdjustMarker
                footer
                accessToken={MAPBOX_ACCESS_TOKEN}
              />
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Continue
            </button>
          </div>
        </form>
      )}

      {activePage === 'confirm' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Confirm Your Order</h2>
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-medium">Shipping Address</h3>
            {displayAddress}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleTryAgain}
              className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Edit Address
            </button>
            <button
              onClick={() => setActivePage('complete')}
              className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Submit Order
            </button>
          </div>
        </div>
      )}

      {activePage === 'complete' && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600">Order Confirmed!</h2>
          <p className="mt-4 text-gray-600">Thank you for your order. It is on its way!</p>
          <button
            onClick={handleTryAgain}
            className="px-4 py-2 mt-6 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Start Again
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressForm;
