import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

export default function About() {
    return (
        <div className="flex justify-center mt-16">
           <Card className="relative w-[700px]">
                <CardHeader>
                    <CardTitle>About Us: The Story Of Pitstop Performance</CardTitle>
                    <CardDescription>
                        Welcome to Pitstop Performance, your trusted destination for premium car parts and accessories. 
                        Our journey began with a simple vision: to create a reliable and accessible platform where car owners and enthusiasts
                         could find top-quality parts to keep their vehicles running at peak performance. Founded by a team of automotive 
                         experts and enthusiasts, Pitstop Performance grew from a passion for all things cars and a commitment to serving the automotive
                          community. Over the years, we’ve built a reputation for delivering exceptional products, expert advice, and unparalleled customer service. 
                          At Pitstop Performance, we understand that your car is more than just a machine; it’s an extension of your life, passion, and goals. 
                          That’s why we carefully curate a wide selection of parts from trusted manufacturers, ensuring every product meets the highest standards of quality and durability. 
                          Whether you're restoring a classic, upgrading your performance vehicle, or simply maintaining your daily driver, Pitstop Performance is here to make your journey smoother and your pit stops shorter. 
                        Thank you for choosing us as your partner on the 
                        road ahead. 
                        We're proud to be your reliable pit stop for all your car part needs!
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
}
