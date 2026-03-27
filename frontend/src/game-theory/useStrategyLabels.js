import { useLanguage } from '../contexts/LanguageContext.jsx';

/**
 * Returns language-aware strategy labels, descriptions, and class mappings.
 */
export function useStrategyLabels() {
  const { t } = useLanguage();
  return {
    STRATEGY_LABELS: t.dilemme.strategyLabels,
    STRATEGY_DESCRIPTIONS: t.dilemme.strategyDescriptions,
    CLASS_TO_LABEL: t.dilemme.classToLabel,
  };
}
