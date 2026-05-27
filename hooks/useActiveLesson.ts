import { useLearningStore } from "@/store/learningStore";
import { Unit, Lesson } from "@/types/learning";

/**
 * Pure selector function to compute the active unit and lesson.
 */
export function getActiveUnitAndLesson(
  getUnitsByLanguage: (langId: string) => Unit[],
  getLessonsByUnit: (unitId: string) => Lesson[],

  selectedLanguageId: string | null
): { activeUnit: Unit | null; activeLesson: Lesson | null; isActiveCompleted: boolean } {
  const units = selectedLanguageId ? getUnitsByLanguage(selectedLanguageId) : [];
  let activeUnit = units[0] || null;
  let activeLesson: Lesson | null = null;

  if (selectedLanguageId) {
    for (const unit of units) {
      const unitLessons = getLessonsByUnit(unit.id);
      const incomplete = unitLessons[0]; // Without lesson completion, just pick the first lesson of the unit
      if (incomplete) {
        activeUnit = unit;
        activeLesson = incomplete;
        break;
      }
    }

    if (!activeLesson && units.length > 0) {
      const lastUnit = units[units.length - 1];
      const unitLessons = getLessonsByUnit(lastUnit.id);
      if (unitLessons.length > 0) {
        activeUnit = lastUnit;
        activeLesson = unitLessons[unitLessons.length - 1];
      }
    }
  }

  const isActiveCompleted = false; // Always false since completion is removed
  return { activeUnit, activeLesson, isActiveCompleted };
}

/**
 * React Hook wrapping the active lesson derivation using the learning store state.
 */
export function useActiveLesson(
  getUnitsByLanguage: (langId: string) => Unit[],
  getLessonsByUnit: (unitId: string) => Lesson[]
): { activeUnit: Unit | null; activeLesson: Lesson | null; isActiveCompleted: boolean } {

  const selectedLanguageId = useLearningStore((state) => state.selectedLanguageId);

  return getActiveUnitAndLesson(
    getUnitsByLanguage,
    getLessonsByUnit,

    selectedLanguageId
  );
}
