export async function createCustomerController(req: any, res:any) {
    try {
        const { db } = req.app;
        const { name, email, phone, address } = req.body;



        //  validation

        if  (!name) {
            return res.status(400).json({ message: 'Name is required' })
        }
        if  (!email) {
            return res.status(400).json({ message: 'Email is required' })
        }

        if  (!phone) {
            return res.status(400).json({ message: 'Phone number is required' })
        } else if (phone.length != 10) {
            return res.status(400).json({ message: 'Phone number must be 10 digits' })
        }

        if  (!address) {
            return res.status(400).json({ message: 'Address is required' })
        } else if (address.length > 100) {
            return res.status(400).json({ message: 'Address must be less than 100 characters' })
        }

        const existingCustomer = await db.collection('customers').findOne({ 
            email: email.toLowerCase()
        })

        if ( existingCustomer ) {
            return res.status(400).json({ message: 'Customer already exists' })
        }



        // API call

        const result = await db.collection('customers').insertOne({
            name,
            email: email.toLowerCase(),
            phone,
            address
        })
        


        // error handling 
        
        if (result.acknowledged) {
            res.status(200).json({ message: 'Customer created' })
        } else {
            throw new Error('Customer not created')
        }

    }
    catch (error) {
        res.status(500).json({ error: error.toString() })
    }
}