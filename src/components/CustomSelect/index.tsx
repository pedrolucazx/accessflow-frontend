import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
  type PathValue,
} from 'react-hook-form';
import Select, {
  components,
  type GroupBase,
  type MultiValueGenericProps,
  type SingleValueProps,
  type StylesConfig,
} from 'react-select';

export interface IOption {
  value: string;
  label: string;
  className?: string;
}

interface GroupOption {
  label: string;
  options: IOption[];
}

interface Props<Type extends FieldValues, IsMulti extends boolean> {
  name: Path<Type>;
  control: Control<Type>;
  options: IOption[] | GroupOption[];
  placeholder?: string;
  isMulti?: IsMulti;
}

const customStyles: StylesConfig<IOption, boolean> = {
  control: (base, state) => ({
    ...base,
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '0.25rem',
    border: '0.063rem solid var(--color-bg-alt)',
    boxShadow: state.isFocused
      ? '0 0 0 0.125rem rgba(225, 0, 152, 0.2)'
      : 'none',
    borderColor: state.isFocused
      ? 'var(--color-primary)'
      : 'var(--color-bg-alt)',
    '&:hover': {
      borderColor: state.isFocused
        ? 'var(--color-primary)'
        : 'var(--color-bg-alt)',
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? 'rgba(225, 0, 152, 0.1)'
      : state.isSelected
        ? 'rgba(225, 0, 152, 0.2)'
        : 'white',
    color: 'black',
    padding: 10,
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'transparent',
    padding: 0,
  }),
  multiValueLabel: (base) => ({
    ...base,
    backgroundColor: 'transparent',
    padding: 0,
  }),
};

export const CustomSelect = <
  Type extends FieldValues,
  IsMulti extends boolean = false,
>({
  name,
  control,
  options,
  placeholder = 'Selecione uma opção',
  isMulti,
}: Props<Type, IsMulti>) => {
  const MultiValueLabel = (
    props: MultiValueGenericProps<IOption, IsMulti, GroupBase<IOption>>
  ) => {
    const { data } = props;
    return (
      <components.MultiValueLabel {...props}>
        <div className={`badge ${data.className}`}>{data.label}</div>
      </components.MultiValueLabel>
    );
  };

  const SingleValue = (
    props: SingleValueProps<IOption, IsMulti, GroupBase<IOption>>
  ) => {
    const { data } = props;
    return (
      <components.SingleValue {...props}>
        <div className={`badge ${data.className}`}>{data.label}</div>
      </components.SingleValue>
    );
  };

  const defaultValue = isMulti
    ? ([] as PathValue<Type, Path<Type>>)
    : (null as PathValue<Type, Path<Type>>);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <Select<IOption, IsMulti, GroupBase<IOption>>
          {...field}
          isMulti={isMulti}
          options={options}
          isClearable={false}
          styles={customStyles}
          onBlur={field.onBlur}
          placeholder={placeholder}
          onChange={(selected) => field.onChange(selected)}
          components={{
            SingleValue: !isMulti ? SingleValue : undefined,
            MultiValueLabel: isMulti ? MultiValueLabel : undefined,
          }}
        />
      )}
    />
  );
};
