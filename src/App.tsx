import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createUserFormSchema = z.object({
  name: z
    .string()
    .nonempty("O nome é obrigatório!")
    .transform((name) => {
      return name
        .trim()
        .split(" ")
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1));
        })
        .join(" ");
    }),
  email: z
    .string()
    .nonempty("E-mail obrigatório!")
    .email("Formato de email inválido")
    .toLowerCase(),
  password: z.string().min(6, "A senha precisa de no mínimo 6 caracteres!"),
  techs: z
    .array(
      z.object({
        title: z.string().nonempty("O título é obrigatório!"),
        knoledge: z.coerce.number().min(1).max(100),
      })
    )
    .min(2, "inisra pelomenos 2 tecnologias"),
});

type CreateUserFormData = z.infer<typeof createUserFormSchema>;

function App() {
  const [outPut, setOutput] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });

  const { fields, append } = useFieldArray({
    control,
    name: "techs",
  });

  function addNewTech() {
    append({ title: "", knoledge: 0 });
  }

  const createUser = (data: CreateUserFormData) => {
    setOutput(JSON.stringify(data, null, 2));
  };

  return (
    <main className="h-screen bg-zinc-800 flex items-center justify-center flex-col text-zinc-100 gap-10">
      <form
        onSubmit={handleSubmit(createUser)}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="nome"
            className="border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-400 text-white"
            {...register("name")}
          />
          {errors.name && <span className="text-red-400 text-sm">{errors.name.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            className="border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-400 text-white"
            {...register("email")}
          />
          {errors.email && <span className="text-red-400 text-sm">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            className="border-zinc-800 shadow-sm rounded h-10 px-3  bg-zinc-400 text-white"
            {...register("password")}
          />
          {errors.password && <span className="text-red-400 text-sm">{errors.password.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor=""
            className="flex items-center justify-between text-emerald-400 text-sm"
          >
            Tecnologia
            <button
              type="button"
              onClick={addNewTech}
              className="text-emerald-400 text-sm"
            >
              Adicionar
            </button>
          </label>

          {fields.map((field, index) => {
            return (
              <div key={field.id} className="flex gap-2">
                <input
                  type="text"
                  id=""
                  className="border-zinc-800 shadow-sm rounded h-10 px-3  bg-zinc-400 text-white flex-1"
                  {...register(`techs.${index}.title`)}
                />
                {errors.techs?.[index]?.title && (
                  <span className="text-red-400 text-sm">{errors.techs?.[index]?.title?.message}</span>
                )}

                <input
                  type="number"
                  id=""
                  className="border-zinc-800 shadow-sm rounded h-10 px-3  bg-zinc-400 text-white flex-1 w-16"
                  {...register(`techs.${index}.knoledge`)}
                />
                {errors.techs?.[index]?.knoledge && (
                  <span className="text-red-400 text-sm">{errors.techs?.[index]?.knoledge?.message}</span>
                )}
              </div>
            );
          })}
          {errors.techs && <span className="text-red-400 text-sm">{errors.techs.message}</span>}
        </div>

        <button
          type="submit"
          className="bg-emerald-400 rounded font-semibold shadow-sm text-white h-10 hover:bg-emerald-500 px-3"
        >
          Salvar
        </button>
      </form>

      <pre>{outPut}</pre>
    </main>
  );
}

export default App;
