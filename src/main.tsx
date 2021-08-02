import React from 'react';
import type {FeatureFlag, FeatureGroup} from './types';

interface ProviderProps<NameType> {
  children: React.ReactNode;
  initiallyEnabled?: Array<NameType>
}

interface CaterpillarContext<NameType extends string> {
  features: FeatureGroup<NameType>;
  setFeature: (name: NameType, active: boolean) => void;
}

interface FeatureProps<NameType> {
  name: NameType;
  fallback?: React.ReactElement;
}

export function initCaterpillar<NameType extends string>(
	features: FeatureGroup<NameType>,
) {
	const Context = React.createContext<CaterpillarContext<NameType> | null>(
		null,
	);

	function useContext() {
		const context = React.useContext(Context);

		if (context === null) {
			throw new Error('You need to setup Caterpillar with a provider');
		}

		return context;
	}

	function useFeatures(): [
    Array<FeatureFlag<NameType>>,
    CaterpillarContext<NameType>['setFeature']
    ] {
		const context = useContext();
		return [
			Object.values<FeatureFlag<NameType>>(context.features),
			context.setFeature,
		];
	}

	function useFeature(name: NameType) {
		return useContext().features[name];
	}

	const Feature: React.FC<FeatureProps<NameType>> = ({
		name,
		children,
		fallback,
	}) => {
		const feature = useFeature(name);

		if (feature.active) {
			return <>{children}</>;
		}

		return fallback ?? null;
	};

	function Provider({children, initiallyEnabled = []}: ProviderProps<NameType>) {
		const [featureGroup, setFeatureGroup] = React.useState(() => initiallyEnabled.reduce((acc, name) => {
			acc[name] = {...acc[name], active: true};
			return acc;
		}, features));

		const setFeature = React.useCallback((name: NameType, active: boolean) => {
			setFeatureGroup(prevFeatures => ({
				...prevFeatures,
				[name]: {
					...prevFeatures[name],
					active,
				},
			}));
		}, []);

		return (
			<Context.Provider
				value={{
					features: featureGroup,
					setFeature,
				}}
			>
				{children}
			</Context.Provider>
		);
	}

	return {
		useFeatures,
		useFeature,
		Feature,
		Provider,
	};
}
