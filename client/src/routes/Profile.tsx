import EditProfile from "@/components/EditProfile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import apiClient from "@/utils/apiClient";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

interface ProfileType {
	name: string | null;
	email: string | null;
}

export default function Profile() {

	const navigate = useNavigate()
	const [profile, setProfile] = useState<ProfileType>({
		name: "",
		email: "",
	});

	useEffect(() => {
		(async function() {
			try {
				const response = await apiClient.get("/user");
				setProfile({
					name: response.data.name,
					email: response.data.email,
				})
			} catch (e: Error | any) {
				if (e.status === 401) {
					navigate("/login")
				}
			}
		})()	
	}, [])
	return (
		<div>
			<h1 className="font-bold text-4xl m-2">Profile</h1>
			<Card>
				<CardHeader>
					<CardTitle>User Data</CardTitle>
					<CardDescription>This contains name and email about the user</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-start">
					<h3 className="font-bold">Name</h3>
					<p className="ml-4">{profile.name}</p>
					<h3 className="font-bold">Email</h3>
					<p className="ml-4">{profile.email}</p>
				</CardContent>
				<CardFooter>
					<Dialog>
						<DialogTrigger className="p-0">
							<Button>Edit</Button>
						</DialogTrigger>
						<EditProfile profile={profile} setProfile={setProfile} />
					</Dialog>
				</CardFooter>
			</Card>
		</div>
	)
}
