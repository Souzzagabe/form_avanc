import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createUserFormSchema = z.object({
  name: z.string().nonempty("O nome é obrigatório!").transform(name => {
    return name.trim().split(' ').map(word => {
      return word[0].toLocaleUpperCase().concat(word.substring(1));
    }).join(" ");
  }),
  
  email: z
    .string()
    .nonempty("E-mail obrigatório!")
    .email("Formato de email inválido")
    .toLowerCase(),
  password: z.string().min(6, "A senha precisa de no mínimo 6 caracteres!"),
});

type CreateUserFormData = z.infer<typeof createUserFormSchema>

function App() {
  const [outPut, setOutput] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });

  const createUser = (data: any) => {
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
          {errors.name && <span>{errors.name.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            className="border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-400 text-white"
            {...register("email")}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            className="border-zinc-800 shadow-sm rounded h-10 px-3  bg-zinc-400 text-white"
            {...register("password")}
          />
          {errors.password && <span>{errors.password.message}</span>}
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
