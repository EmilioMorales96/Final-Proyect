import TextInput from "./TextInput";
import TextareaInput from "./TextareaInput";
import RadioInput from "./RadioInput";
import CheckboxInput from "./CheckboxInput";
import SelectInput from "./SelectInput";
import FileInput from "./FileInput";
import LinearScaleInput from "./LinearScaleInput";
import RatingInput from "./RatingInput";
import GridRadioInput from "./GridRadioInput";
import GridCheckboxInput from "./GridCheckboxInput";
import DateInput from "./DateInput";
import TimeInput from "./TimeInput";

export const QUESTION_TYPE_COMPONENTS = {
  text: TextInput,
  textarea: TextareaInput,
  radio: RadioInput,
  checkbox: CheckboxInput,
  select: SelectInput,
  file: FileInput,
  linear: LinearScaleInput,
  rating: RatingInput,
  grid_radio: GridRadioInput,
  grid_checkbox: GridCheckboxInput,
  date: DateInput,
  time: TimeInput,
};