"use client";
import { useEffect, useState } from "react";

type InputProps = {
  label: string;
  name: string;
  type?: "number" | "text" | "password";
  className?: string;
  canBeEmpty?: boolean;
  initValue?: string | null | undefined;
};

let inputTouched = false;

export default function Input({
  label,
  name,
  type = "text",
  className,
  canBeEmpty = false,
  initValue,
}: InputProps) {
  const [userInput, setUserInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (initValue) {
      setUserInput(initValue);
      setIsEmpty(false);
      inputTouched = true;
    }
  }, [initValue]);

  useEffect(() => {
    if (userInput.trim() == "") {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [userInput]);

  const onBlurHandler = () => {
    setIsFocused(false);
  };

  const onFocusHandler = () => {
    inputTouched = true;
    setIsFocused(true);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  return (
    <div className="flex flex-col">
      <p>{label}</p>
      <input
        name={name}
        className={`p-1 border-2 border-lime-600 rounded-md bg-zinc-200/20 text-gray-50 focus:outline-none ${
          isFocused && "border-cyan-400"
        } ${
          inputTouched &&
          isEmpty &&
          !isFocused &&
          !canBeEmpty &&
          "border-pink-600"
        } ${className ? className : ""}`}
        type={type}
        placeholder="..."
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        onChange={onChangeHandler}
        value={userInput}
      />
    </div>
  );
}
