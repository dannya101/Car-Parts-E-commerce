'use client';
import React, { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/navbutton";



type CheckoutInformationProps = {
    handleCloseModal: () => void;
}

type Address = {
    id: number;
    street_address: string;
    city: string;
    postal_code: string;
    state: string;
    country: string;
    is_billing: boolean;
    is_shipping: boolean;
}

export default function CheckoutInformation({handleCloseModal}: CheckoutInformationProps) {
    //Tab Data
    const [tabValue, setTabValue] = useState("select");
    
    //Address Data
    const [is_seperate_shipping_address, setIsSeperate] = useState<boolean>(true);
    const [addresses, setAddresses] = useState<Address[]>([]);

    const [street_address, setStreetAddress] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [state, setState] = useState<string>("");
    const [country, setCountry] = useState<string>("");
    const [zip, setZip] = useState<string>("");
    const [is_billing, setBilling] = useState<boolean>(true);
    const [is_shipping, setShipping] = useState<boolean>(false);

    //Checkout Information
    const [shipping_address_id, setShippingAddressID] = useState<number | null>(null);
    const [billing_address_id, setBillingAddressID] = useState<number | null>(null);
    const [payment_method, setPaymentMethod] = useState<string>("Card");
    const [shipping_method, setShippingMethod] = useState<string>("Regular Shipping(3-5 Days)");

    const [checkout_started, setCheckoutStarted] = useState<boolean>(false);

    useEffect(() => {
        if(tabValue === "select") {
            fetchUserAddresses();
        }

        if(!is_seperate_shipping_address)
        {
            setShippingAddressID(billing_address_id);
        }

        if(checkout_started) {
            setCheckoutData();
        }
    }, [tabValue, is_seperate_shipping_address, billing_address_id, checkout_started]);

    const fetchUserAddresses = async () => {
        const token = sessionStorage.getItem("access_token");

        if(!token) {
            console.error("Not Authenticated");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/checkout/address/all", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });
            const data = await response.json();

            if (response.ok) {
                setAddresses(data);
                console.log("Addresses: ", data);
            } else {
                throw new Error("ERROR");
            }

        } catch (error) {
            console.error("Error Fetching Addresses: ", error);
        }

    };

    const startCheckout = async () => {
        const token = sessionStorage.getItem("access_token");
        if(!token) {
            console.error("Not Authenticated");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/checkout/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });
        } catch (error) {
            console.log("Error starting new checkout: ", error);
        }

        console.log("Checkout Started");

        setCheckoutStarted;
    };

    const setCheckoutData = async () => {

        console.log("Shipping Address ID: ", shipping_address_id);
        console.log("Billing Address ID: ", billing_address_id);
        console.log("Payment Method: ", payment_method);
        console.log("Shipping Method: ", shipping_method);

        const token = sessionStorage.getItem("access_token");
        if(!token) {
            console.error("Not Authenticated");
            return;
        }

        try {
            const shipping_response = await fetch(`http://localhost:8000/checkout/address/setshipping?id=${shipping_address_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });
            const billing_response = await fetch(`http://localhost:8000/checkout/address/setbilling?id=${billing_address_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });
            const payment_method_response = await fetch(`http://localhost:8000/checkout/payment-method?payment_method=${payment_method}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });
            const shipping_method_response = await fetch(`http://localhost:8000/checkout/shipping-method?shipping_method=${shipping_method}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

        } catch (error) {
            console.error("ERROR SETTING CHECKOUT DATA: ", error);
        }

        console.log("CHECKOUT DATA ADDED TO DB");
        completeCheckout();
    };

    const completeCheckout = async () => {
        const token = sessionStorage.getItem("access_token");
        if(!token) {
            console.error("Not Authenticated");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/checkout/complete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });
        } catch (error) {
            console.error("ERROR FINALIZING CHECKOUT: ", error);
        }

        console.log("CHECKOUT COMPLETED")
    };

    const createUserAddress = async () => {
        const token = sessionStorage.getItem("access_token");
        if(!token) {
            console.error("Not Authenticated");
            return;
        }

        if(!street_address || !city || !state || !zip || !country) {
            console.error("Form not filled out!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/checkout/address", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    street_address: street_address,
                    city: city,
                    state: state,
                    postal_code: zip,
                    country: country,
                    is_billing: is_billing,
                    is_shipping: is_shipping,
                })
            });
        } catch (error) {
            console.log("Error submitting new address: ", error);
        }

        setStreetAddress("");
        setCity("");
        setState("");
        setZip("");
        setCountry("");
        setTabValue("select");
    };

    const handleCheckboxChange = (checked: boolean | "indeterminate") => {
        if(checked == true) {
            setIsSeperate(false);
            setShipping(true);
        } else {
            setShipping(false);
        }

    };

    const handleAddressChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        if(selectedValue === "new") {
            setTabValue("new");
        } else {
            const addressID = parseInt(selectedValue, 10);

            if(event.target.name === "billing") {
                //SET BILLING ADDRESS ID
                setBillingAddressID(addressID);
                console.log("Billing Address Changed: ", addressID);
            } else if(event.target.name === "shipping") {
                //SET SHIPPING ADDRESS ID
                setShippingAddressID(addressID);
                console.log("Shipping Address Changed", addressID);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2">
                <h2 className="text-2xl font-bold text-center mb-4">Complete Your Order</h2>

                <form>
                {/* Payment Method */}
                <div className="mb-4">
                    <label className="block text-lg font-medium mb-2">Payment Method</label>
                    <select className="w-full p-2 border rounded" onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option value="Card">Credit Card</option>
                        <option value="Cashapp">CashApp</option>
                        <option value="Venmo">Venmo</option>
                    </select>
                </div>

                {/* Shipping Method */}
                <div className="mb-4">
                    <label className="block text-lg font-medium mb-2">Shipping Method</label>
                    <select className="w-full p-2 border rounded" onChange={(e) => setShippingMethod(e.target.value)}>
                        <option value="Regular Shipping(3-5 Days)">Regular Shipping (3-5 Days)</option>
                        <option value="Next Day Shipping(1-2 Days)">Next Day Shipping (1-2 Days)</option>
                        <option value="Priority Shipping(1 Day)">Priority Shipping (1 Day)</option>
                    </select>
                </div>

                {/* Address */}
                {/* Tabs for "Submit Ticket" and "View Tickets" */}
                <div className="bg-white shadow-md rounded-lg p-6 pt-10">
                    <Tabs value={tabValue} onValueChange={setTabValue}>
                        <TabsList className="flex justify-center mb-4">
                            <TabsTrigger value="select">Select Billing Address</TabsTrigger>
                            <TabsTrigger value="new">New Address</TabsTrigger>
                        </TabsList>

                        {/* Submit Ticket Section */}
                        <TabsContent value="select">
                            <select className="w-full p-2 border rounded" onChange={handleAddressChange} name="billing">
                                <option value="new">Add New Address . . .</option>
                                {
                                addresses.map((address, index) => (
                                    <option key={index} value={address.id}>{address.street_address}, {address.city}, {address.postal_code}</option>
                                ))}
                            </select>
                            {/*<div className="flex items-center space-x-2 pt-4">
                                <Checkbox id="isShippingCheck" defaultChecked checked={is_shipping} onCheckedChange={handleCheckboxChange}/>
                                <label htmlFor="isShippingCheck">Use Address For Shipping?</label>
                            </div>*/}
                            <div className="mb-4">
                                <label className="block text-lg font-medium mb-2">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => handleCheckboxChange}
                                        className="mr-2"
                                    />
                                    Shipping address is the same as billing address
                                </label>
                            </div>
                            
                            {!is_shipping && (
                                <select className="w-full p-2 border rounded" onChange={handleAddressChange} name="shipping">
                                    <option value="new">Add New Address . . .</option>
                                    {
                                    addresses.map((address, index) => (
                                        <option key={index} value={address.id}>{address.street_address}, {address.city}, {address.postal_code}</option>
                                    ))}
                                </select>
                            )}

                        </TabsContent>

                        {/*  */}
                        <TabsContent value="new">
                            <div className="mb-4">
                                <label className="block text-lg font-medium mb-2">New Address</label>
                                <input 
                                    type="text" 
                                    placeholder="Street Address" 
                                    className="w-full p-2 border rounded mb-2" 
                                    onChange={(e) => setStreetAddress(e.target.value)}
                                    />

                                <input 
                                    type="text" 
                                    placeholder="City" 
                                    className="w-full p-2 border rounded mb-2" 
                                    onChange={(e) => setCity(e.target.value)}
                                    />
                                <input 
                                    type="text" 
                                    placeholder="State/Province" 
                                    className="w-full p-2 border rounded mb-2" 
                                    onChange={(e) => setState(e.target.value)}
                                    />
                                <input 
                                    type="text" 
                                    placeholder="ZIP Code" 
                                    className="w-full p-2 border rounded mb-2" 
                                    onChange={(e) => setZip(e.target.value)}
                                    />
                                <input 
                                    type="text" 
                                    placeholder="Country" 
                                    className="w-full p-2 border rounded mb-2" 
                                    onChange={(e) => setCountry(e.target.value)}
                                    />
                            </div>
                            <Button type="button" onClick={createUserAddress}>Add Address</Button>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Buttons */}
                <div className="flex justify-between pt-10">
                    <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                    >
                    Close
                    </button>
                    <button
                    type="button"
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    onClick={startCheckout}
                    >
                    Confirm Order
                    </button>
                </div>
                </form>
            </div>
            </div>
    )
}