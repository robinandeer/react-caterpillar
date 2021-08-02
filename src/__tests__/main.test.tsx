import React from 'react';
import {renderHook, WrapperComponent, act} from '@testing-library/react-hooks';
import {initCaterpillar} from '../';

test('setting up Caterpillar', () => {
	const features = {
		'feature-1': {
			name: 'feature-1',
			description: 'description-1',
			active: true,
		},
	};

	const Caterpillar = initCaterpillar(features);

	const wrapper: WrapperComponent<any> = ({children}) => <Caterpillar.Provider>{children}</Caterpillar.Provider>;
	const {result} = renderHook(() => Caterpillar.useFeatures(), {wrapper});
	const [allFeatures] = result.current;
	expect(allFeatures.length).toBe(Object.keys(features).length);
	expect(allFeatures[0].name).toBe(features['feature-1'].name);
});

test('using Caterpillar without a Provider throws error', () => {
	const features = {
		'feature-1': {
			name: 'feature-1',
			description: 'description-1',
			active: true,
		},
	};

	const Caterpillar = initCaterpillar(features);

	const {result} = renderHook(() => Caterpillar.useFeatures(), {});
	expect(() => result.current).toThrowError(/Caterpillar/);
});

test('Setting up Caterpillar with an initially enabled feature', () => {
	const features = {
		'feature-1': {
			name: 'feature-1',
			description: 'description-1',
			active: false,
		},
		'feature-2': {
			name: 'feature-2',
			description: 'description-2',
			active: false,
		},
	};

	const Caterpillar = initCaterpillar(features);
	const enabledFeatures = ['feature-1'];
	const wrapper: WrapperComponent<any> = ({children}) => (
		<Caterpillar.Provider initiallyEnabled={enabledFeatures}>{children}</Caterpillar.Provider>
	);
	const {result} = renderHook(() => Caterpillar.useFeature('feature-1'), {wrapper});
	expect(result.current.active).toBe(true);

	const {result: result2} = renderHook(() => Caterpillar.useFeature('feature-2'), {wrapper});
	expect(result2.current.active).toBe(false);
});

test('Toggling feature active status', () => {
	const features = {
		'feature-1': {
			name: 'feature-1',
			description: 'description-1',
			active: false,
		},
	};

	const Caterpillar = initCaterpillar(features);
	const wrapper: WrapperComponent<any> = ({children}) => (
		<Caterpillar.Provider>{children}</Caterpillar.Provider>
	);

	const {result} = renderHook(() => Caterpillar.useFeatures(), {wrapper});
	const [allFeaturesBefore, setFeature] = result.current;

	expect(allFeaturesBefore[0].name).toBe('feature-1');
	expect(allFeaturesBefore[0].active).toBe(false);

	act(() => setFeature('feature-1', true));

	const [allFeaturesAfter] = result.current;
	expect(allFeaturesAfter[0].active).toBe(true);
});
