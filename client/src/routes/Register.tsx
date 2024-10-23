import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import apiClient from "@/utils/apiClient"

const FormSchema = z.object({
  name: z.string().min(3, {
    message: "Please enter at least three characters",
  }),
  email: z.string().min(2, {
    message: "Incorrect email address",
  }),
  password: z.string().min(8, {
    message: "Incorrect password length",
  }),
})

export default function Register() {

	const navigate = useNavigate();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	})

	async function onSubmit(data: z.infer<typeof FormSchema>) {

		const formData = new FormData();
		formData.append("email", data.email)
		formData.append("password", data.password)
		formData.append("name", data.name)

		try {
			const response = await apiClient.post("http://localhost:5000/register", formData);
			localStorage.setItem("access_token", response.data.access_token)

			toast({
				title: "Form submitted successfully",
				description: "You are registered successfully"
			})

			navigate("/profile")

		} catch (e: Error | any) {
			toast({
				title: "Form not submitted",
				description: e.response.data.message
			})
		}
	}

	return (
		<div className="w-[25rem] flex flex-col justify-start items-center">
			<h1 className="font-bold text-3xl mb-2">Register</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="flex flex-col justify-start items-start">
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder="Name" {...field} />
								</FormControl>
								<FormDescription>
									This is your name
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem className="flex flex-col justify-start items-start">
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="Email" {...field} />
								</FormControl>
								<FormDescription>
									This is your email address
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem className="flex flex-col justify-start items-start">
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type="password" placeholder="Password" {...field} />
								</FormControl>
								<FormDescription>
									This is your password
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit">Submit</Button>
				</form>
			</Form>
		</div>
	)
}
