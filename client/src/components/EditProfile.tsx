import { Button } from "@/components/ui/button"
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import apiClient from "@/utils/apiClient"
import { useEffect } from "react"

const FormSchema = z.object({
	email: z.string().min(2, {
		message: "Incorrect email address",
	}),
	name: z.string().min(3, {
		message: "Incorrect name length",
	}),
})

export default function EditProfile({ profile, setProfile }:  { profile: { name: string, email: string }, setProfile: Function}) {


	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			name: profile.name,
			email: profile.email,
		},
	})

	useEffect(() => {
		form.reset({
			name: profile.name,
			email: profile.email,
		})
	}, [profile, form.reset])

	async function onSubmit(data: z.infer<typeof FormSchema>) {

		const formData = new FormData();
		formData.append("email", data.email)
		formData.append("name", data.name)

		try {
			const response = await apiClient.put("/user", formData);
			if (response.status === 200) {
				setProfile(data)
			}

			toast({
				title: "Form submitted successfully",
				description: "Profile has been updated"
			})

		} catch (e: Error | any) {
			toast({
				title: "Form not submitted",
				description: e.response.data.message
			})
		}
	}

	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Edit profile</DialogTitle>
				<DialogDescription>
					Make changes to your profile here. Click save when you're done.
				</DialogDescription>
			</DialogHeader>
			<div className="grid gap-4 py-4">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="flex flex-col justify-start items-start">
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input type="name" placeholder="Name" {...field} />
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
					<Button type="submit">Submit</Button>
				</form>
			</Form>
			</div>
		</DialogContent>
	)
}

