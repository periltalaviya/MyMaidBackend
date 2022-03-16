const Pool = require('pg').Pool;
const connectionString = 'postgres://igctkilhwycflm:7fdd13c3e6d018754c9d6ad444da4bfc2ac5a8d94cf1c49c598816b3901c9849@ec2-54-158-26-89.compute-1.amazonaws.com:5432/d7p1jgb443mnch';
const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
})

// Admin

const addAdmin = (req, res) => {
    const { fname, lname, email, password, gender, dob, profile, isdisable } = req.body;
    pool.query('insert into admin(fname, lname, email, password, gender, dob, profile, isdisable) values ($1,$2,$3,$4,$5,$6,$7,$8)',
        [fname, lname, email, password, gender, dob, profile[0], isdisable], (error, result) => {
            if (error) {
                throw error;
            }
            res.status(201).send(`Admin added with id : ${result.admin_id}`);
        });
}

const getAdmin = (req, res) => {
    pool.query('select * from admin where isdisable=false', (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).json(result.rows);
    })
}

const getAdminById = (req, res) => {
    const admin_id = parseInt(req.params.admin_id);
    pool.query('select * from admin where admin_id=$1', [admin_id], (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).json(result.rows);
    })
}

const updateAdmin = (req, res) => {
    const admin_id = parseInt(req.body.admin_id);
    const { fname, lname, email, gender, dob, profile } = req.body;
    pool.query('update admin set fname=$1, lname=$2, email=$3, gender=$4, dob=$5, profile=$6 where admin_id=$7',
        [fname, lname, email, gender, dob, profile[0], admin_id],
        (error, result) => {
            if (error) {
                throw error;
            }
            res.status(200).send(`Admin updated by id${admin_id}`);
        })
}

const deleteAdmin = (req, res) => {
    const admin_id = parseInt(req.params.admin_id);
    pool.query('update admin set isdisable=true where admin_id=$1', [admin_id], (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).send(`Admin Deleted by Id : ${admin_id}`);
    });
}

const getAdminLogin = (request, response) => {
    const { email, password } = request.body;
    pool.query('select * from admin where email=$1 and password=$2', [email, password], (error, result) => {
        if (error) {
            throw error;
        }

        if (result.rows == "") {
            response.send({ status: 201, msg: 'No Data found' });
        } else {
            response.send({ status: 200, msg: 'Successfully Login..', data: result.rows });
        }
    });
}

const changeAdminPassword = (req, res) => {
    const { admin_id, password } = req.body
    console.log("p ", admin_id);
    pool.query('update admin set password=$1 where admin_id=$2',
        [password, admin_id],
        (error, result) => {
            if (error) {
                throw error;
            }
            res.status(200).send(`Successfully your password change `);
        })
}

const forgotAdminPassword = (req, res) => {

    const { email, password } = req.body
    console.log("p ", email);
    pool.query('update admin set password=$1 where email=$2',
        [password, email],
        (error, result) => {
            if (error) {
                throw error;
            }
            res.status(200).send(`Successfully your password change `);
        })
}

// Maid
const addMaid = (request, response) => {
    const { fname, lname, email, password, gender, dob, experience, pincode, profile, aadhar_card, isdisable, status_id, phoneno1, phoneno2 } = request.body
    pool.query('insert into maid(fname, lname, email, password, gender, dob, experience, pincode, profile, aadhar_card, status_id, isdisable,phoneno1,phoneno2) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,$13,$14)',
        [fname, lname, email, password, gender, dob, experience, pincode, profile[0], aadhar_card[0], status_id, isdisable, phoneno1, phoneno2], (error, result) => {
            if (error) {
                throw error;
            }
            response.status(200).send(`Maid added ${result.maid_id}`)
        })
}

const getMaid = (request, response) => {
    pool.query('select * from maid where isdisable=false', (error, result) => {
        if (error) {
            throw error;
        }
        response.status(201).json(result.rows);
    })
}

const getMaidById = (request, response) => {
    const maid_id = parseInt(request.params.maid_id)
    pool.query('select * from maid where maid_id=$1', [maid_id], (error, result) => {
        if (error) {
            throw error;
        }
        response.status(201).json(result.rows);
    })
}

const getAllMaidDetail = (request, response) => {
    pool.query('select m.*,array_agg(c.category_name),p.location_name,p.city from maid_category as mc,maid as m, category as c ,location as p where mc.maid_id = m.maid_id and mc.category_id = c.category_id and m.pincode = p.pincode group by m.maid_id,p.location_name,p.city', (error, result) => {
        if (error) {
            throw error;
        }
        response.status(201).json(result.rows);
    })
}


const getMaidDetail = (request, response) => {
    const maid_id = parseInt(request.params.maid_id)
    pool.query('select m.*,array_agg(c.category_name),p.location_name, p.city from maid_category as mc,maid as m,location as p, category as c  where mc.maid_id = m.maid_id and m.pincode = p.pincode and mc.category_id = c.category_id and  mc.maid_id = $1 group by m.maid_id,p.location_name,p.city', [maid_id], (error, result) => {
        if (error) {
            throw error;
        }
        response.status(201).json(result.rows);
    })
}

const updateMaid = (request, response) => {
    const maid_id = parseInt(request.body.maid_id)
    const { fname, lname, email, password, gender, dob, experience, pincode, profile, aadhar_card, isdisable, status_id, phoneno1, phoneno2 } = request.body
    pool.query('update maid set fname=$1,lname=$2, email=$3, password=$4, gender=$5, dob=$6, experience=$7, pincode=$8, profile=$9, aadhar_card=$10, isdisable=$11, status_id=$12, phoneno1=$13 ,phoneno2=$14 where maid_id = $15',
        [fname, lname, email, password, gender, dob, experience, pincode, profile[0], aadhar_card, isdisable, status_id, phoneno1, phoneno2, maid_id], (error, result) => {
            if (error) {
                throw error;
            }
            response.status(202).send(`Maid updated ${maid_id}`)
        })
}

const deleteMaid = (request, response) => {
    const maid_id = parseInt(request.params.maid_id)
    pool.query('update maid set isdisable=true where maid_id = $1', [maid_id], (error, result) => {
        if (error) {
            throw error;
        }
        response.status(204).send(`deleted ${maid_id}`)
    })
}

const getMaidLogin = (request, response) => {
    const { email, password } = request.body;
    pool.query('select * from maid where email=$1 and password=$2', [email, password], (error, result) => {
        if (error) {
            throw error;
        }

        if (result.rows == "") {
            response.send({ status: 201, msg: 'No Data found' });
        } else {
            response.send({ status: 200, msg: 'Successfully Login..', data: result.rows });
        }
    })
}

const changeMaidPassword = (req, res) => {

    const { maid_id, password } = req.body
    console.log("p ", maid_id);
    pool.query('update maid set password=$1 where maid_id=$2',
        [password, maid_id],
        (error, result) => {
            if (error) {
                throw error;
            }
            res.status(200).send(`Successfully your password change `);
        })
}


const forgotMaidPassword = (req, res) => {
    const { email, password } = req.body
    pool.query('update maid set password=$1 where email=$2', [password, email], (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).send(`Successfully your password change `)
    })
}

// Maid Phone
const addMaidPhone = (request, response) => {
    const { maid_id, phoneno } = request.body
    pool.query('insert into maid_phoneno values ($1, $2)', [maid_id, phoneno], (error, result) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`Maid's phoneno added ${result.maid_id}`)
    })
}

const getMaidPhone = (request, response) => {
    pool.query('select * from maid_phoneno', (error, result) => {
        if (error) {
            throw error;
        }
        response.status(201).json(result.rows);
    })
}

const updateMaidPhone = (request, response) => {
    const maid_id = parseInt(request.body.maid_id)
    const { phoneno } = request.body
    pool.query('update maid_phoneno set phoneno = $1 where maid_id = $2', [phoneno, maid_id], (error, result) => {
        if (error) {
            throw error;
        }
        response.status(202).send(`Maid's Phoneno updated ${result.maid_id}`)
    })
}

const deleteMaidPhone = (request, response) => {
    const maid_id = parseInt(request.params.maid_id)
    pool.query('delete from maid_phoneno where maid_id = $1', [maid_id], (error, result) => {
        if (error) {
            throw error;
        }
        response.status(204).send(`deleted ${maid_id}`)
    })
}


//Location
const addLocation = (request, response) => {
    const { pincode, location_name, city } = request.body
    pool.query('insert into location values($1, $2, $3)', [pincode, location_name, city], (error, result) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`Location added ${result.pincode}`)
    })
}

const getLocation = (request, response) => {
    pool.query('select * from location', (error, result) => {
        if (error)
            throw error
        response.status(200).json(result.rows)
    })
}

const getLocationById = (request, response) => {
    const pincode = parseInt(request.params.pincode)
    pool.query('select * from location where pincode=$1', [pincode], (error, result) => {
        if (error) {
            throw error;
        }
        response.status(201).json(result.rows);
    })
}

const getLocationByCity = (request, response) => {
    const city = parseInt(request.params.city)
    pool.query('select * from location where city=$1', [city], (error, result) => {
        if (error) {
            throw error;
        }
        response.status(201).json(result.rows);
    })
}


const updateLocation = (request, response) => {
    const pincode = parseInt(request.body.pincode)
    const { location_name, city } = request.body
    pool.query('update location set location_name=$1, city = $2 where pincode = $3', [location_name, city, pincode], (error, result) => {
        if (error) {
            throw error;
        }
        response.status(202).send(`Location updated ${pincode}`)
    })
}

const deleteLocation = (request, response) => {
    const pincode = parseInt(request.params.pincode)
    pool.query('delete from location where pincode = $1', [pincode], (error, result) => {
        if (error) {
            throw error;
        }
        response.status(204).send(`deleted ${pincode}`)
    })
}

//Client
const addClient = (request, response) => {
    const { fname, lname, gender, dob, email, password, profile, isdisable, phoneno1, phoneno2 } = request.body
    pool.query('insert into client(fname, lname, gender, dob, email, password, profile, isdisable,phoneno1, phoneno2) values ($1, $2, $3, $4, $5, $6, $7, $8,$9,$10)',
        [fname, lname, gender, dob, email, password, profile[0], isdisable, phoneno1, phoneno2], (error, result) => {
            if (error) {
                throw error;
            }
            response.status(200).send(`Client added ${result.client_id}`)
        })
}

const getClient = (request, response) => {
    pool.query('select * from client where isdisable=false', (error, result) => {
        if (error)
            throw error;
        response.status(201).json(result.rows)
    })
}

const getClientById = (request, response) => {
    const client_id = parseInt(request.params.client_id)
    pool.query('select * from client where client_id=$1', [client_id], (error, result) => {
        if (error) {
            throw error;
        }
        response.status(201).json(result.rows);
    })
}

const updateClient = (request, response) => {
    const client_id = parseInt(request.body.client_id)
    const { fname, lname, gender, dob, email, password, profile, isdisable, phoneno1, phoneno2 } = request.body
    pool.query('update client set fname=$1, lname=$2, gender=$3, dob=$4, email=$5, password=$6, profile=$7, isdisable=$8,phoneno1=$9, phoneno2=$10 where client_id = $11',
        [fname, lname, gender, dob, email, password, profile[0], isdisable, phoneno1, phoneno2, client_id], (error, result) => {
            if (error) {
                throw error;
            }
            response.status(202).send(`Client updated ${result.client_id}`)
        })
}

const deleteClient = (request, response) => {
    const client_id = parseInt(request.params.client_id)
    pool.query('update client set isdisable=true where client_id = $1', [client_id], (error, result) => {
        if (error) {
            throw error;
        }
        response.status(204).send(`deleted ${client_id}`)
    })
}

const getClientLogin = (request, response) => {
    const { email, password } = request.body;
    pool.query('select * from client where email=$1 and password=$2', [email, password], (error, result) => {
        if (error) {
            throw error;
        }

        if (result.rows == "") {
            response.send({ status: 201, msg: 'No Data found' });
        } else {
            response.send({ status: 200, msg: 'Successfully Login..', data: result.rows });
        }
    })
}

const changeClientPassword = (request, response) => {
    const { client_id, password } = request.body
    console.log("Client ", client_id);
    pool.query('update client set password=$1 where client_id=$2',
        [password, client_id],
        (error, result) => {
            if (error) {
                throw error;
            }
            response.status(200).send(`Successfully your password chage `)
        })
}

const forgotClientPassword = (req, res) => {
    const { email, password } = req.body
    pool.query('update client set password=$1 where email=$2', [password, email], (error, result) => {
        if (error) {
            throw error
        }
        res.status(200).send("Success")
    })
}

// Client Phone
const addClientPhone = (request, response) => {
    const { client_id, phoneno } = request.body
    pool.query('insert into client_phoneno values ($1, $2)', [client_id, phoneno], (error, result) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`Client's phoneno added ${result.client_id}`)
    })
}

const getClientPhone = (request, response) => {
    pool.query('select * from client_phoneno', (error, result) => {
        if (error)
            throw error;
        response.status(201).json(result.rows)
    })
}

const updateClientPhone = (request, response) => {
    const client_id = parseInt(request.body.client_id)
    const { phoneno } = request.body
    pool.query('update client_phoneno set phoneno = $1 where client_id = $2', [phoneno, client_id], (error, result) => {
        if (error) {
            throw error;
        }
        response.status(202).send(`Client updated ${result.client_id}`)
    })
}

const deleteClientPhone = (request, response) => {
    const client_id = parseInt(request.params.client_id)
    pool.query('delete from client_phoneno where client_id = $1', [client_id], (error, result) => {
        if (error) {
            throw error;
        }
        response.status(204).send(`deleted ${client_id}`)
    })
}

//Address 
const addAddress = (req, res) => {
    const { client_id, door_no, street_name, pincode } = req.body;
    pool.query('insert into address(client_id, door_no, street_name, pincode) values ($1,$2,$3,$4)',
        [client_id, door_no, street_name, pincode], (error, result) => {
            if (error) {
                throw error;
            }
            res.status(201).send(`Address added with id : ${result.address_id}`);
        });
}

const getAddress = (req, res) => {
    pool.query('select * from address', (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).json(result.rows);
    })
}

const getAddressById = (req, res) => {
    const client_id = parseInt(req.params.client_id);
    pool.query('select a.*, l.* from address a, location l where a.pincode=l.pincode and a.client_id=$1;', [client_id], (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).json(result.rows);
    })
}

const getAddressByAddressId = (req, res) => {
    const address_id = parseInt(req.params.address_id);
    pool.query('select * from address where address_id=$1', [address_id], (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).json(result.rows);
    })
}


const updateAddress = (req, res) => {
    const address_id = parseInt(req.body.address_id);
    const { client_id, door_no, street_name, pincode } = req.body;
    pool.query('update address set client_id=$1, door_no=$2, street_name=$3, pincode=$4 where address_id=$5',
        [client_id, door_no, street_name, pincode, address_id],
        (error, result) => {
            if (error) {
                throw error;
            }
            res.status(200).send(`Address updated by id ${address_id}`);
        })
}

const deleteAddress = (req, res) => {
    const address_id = parseInt(req.params.address_id);
    pool.query('delete from address where address_id=$1', [address_id], (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).send(`Address Deleted by Id : ${address_id}`);
    });
}

// Booking
const addBooking = (req, res) => {
    const { client_id, maid_id, category_id, start_date, end_date, prefer_start_time,
        prefer_end_time, house_size, address_id, comments, status_id } = req.body;
    pool.query('insert into booking(client_id, maid_id, category_id, start_date, end_date, prefer_start_time, prefer_end_time, house_size, address_id, comments, status_id) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',
        [client_id, maid_id, category_id, start_date, end_date, prefer_start_time,
            prefer_end_time, house_size, address_id, comments, status_id], (error, result) => {
                if (error) {
                    throw error;
                }
                res.status(201).send(`Successfully Booked!! ${result.booking_id}`);
            });
}

const getBooking = (req, res) => {
    pool.query('select * from booking', (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).json(result.rows);
    })
}

const getBookingByClientid = (req, res) => {
    const client_id = parseInt(req.params.client_id)
    pool.query('select m.*,c.*,b.*,a.*,l.* from booking b, category c, maid m, address a, location l where b.maid_id = m.maid_id and b.category_id = c.category_id and b.address_id = a.address_id and a.pincode=l.pincode and b.client_id = $1', [client_id], (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).json(result.rows);
    })
}

const getBookingByMaidId = (req, res) => {
    const maid_id = parseInt(req.params.maid_id)
    pool.query('select c.*,ca.*,a.*,b.* from booking b, client c , category ca , address a where b.client_id = c.client_id and b.category_id = ca.category_id and b.address_id = a.address_id and b.maid_id = $1', [maid_id], (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).json(result.rows);
    })
}

const updateBooking = (req, res) => {
    const booking_id = parseInt(req.body.booking_id);
    const { client_id, maid_id, category_id, start_date, end_date, prefer_start_time, prefer_end_time, house_size, address_id, comments, status_id } = req.body;
    pool.query('update booking set client_id=$1, maid_id=$2, category_id=$3, start_date=$4, end_date=$5, prefer_start_time=$6, prefer_end_time=$7, house_size=$8, address_id=$9, comments=$10, status_id=$11 where booking_id=$12',
        [client_id, maid_id, category_id, start_date, end_date, prefer_start_time, prefer_end_time, house_size, address_id, comments, status_id, booking_id],
        (error, result) => {
            if (error) {
                throw error;
            }
            res.status(200).send(`Successfully Booking ${booking_id} updated!!`);
        })
}

const updateBookingStatus = (req, res) => {
    const { status_id, booking_id } = req.body;
    pool.query('update booking set status_id=$1 where booking_id=$2',
        [status_id, booking_id],
        (error, result) => {
            if (error) {
                throw error;
            }
            res.status(200).send(`Successfully Booking ${booking_id} updated!!`);
        })
}


const deleteBooking = (req, res) => {
    const booking_id = parseInt(req.params.booking_id);
    pool.query('delete from booking where booking_id=$1', [booking_id], (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).send(`Booking Deleted by Id : ${booking_id}`);
    });
}

const addCategory = (request, response) => {
    const { category_name } = request.body;
    pool.query('insert into category (category_name) values ($1)', [category_name], (error, result) => {
        if (error) {
            throw error;
        }
        response.status(201).send(`Category added ${result.category_id}`)
    })
}

const getCategory = (req, res) => {
    pool.query('select * from category', (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).json(result.rows);
    })
}

const getCategoryById = (req, res) => {
    const category_id = parseInt(req.params.category_id);
    pool.query('select * from category where category_id=$1', [category_id], (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).json(result.rows);
    })
}

const updateCategory = (req, res) => {
    const category_id = parseInt(req.body.category_id);
    const { category_name } = req.body;
    pool.query('update category set category_name=$1 where category_id=$2',
        [category_name, category_id],
        (error, result) => {
            if (error) {
                throw error;
            }
            res.status(200).send(`Successfully updated ${category_id}`);
        })
}

const deleteCategory = (req, res) => {
    const category_id = parseInt(req.params.category_id);
    pool.query('delete from category where category_id=$1', [category_id], (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).send(`Deleted ${category_id}`);
    });
}

// Maid category

const addMaidCategory = (req, res) => {
    const { maid_id, category_id, charge } = req.body;
    pool.query('insert into maid_category values ($1,$2,$3)',
        [maid_id, category_id, charge], (error, result) => {
            if (error) {
                throw error;
            }
            res.status(201).send(`Maid Category added with id : ${result.maid_id}`);
        });
}


const getMaidCategory = (req, res) => {
    const maid_id = parseInt(req.params.maid_id)
    pool.query('select * from maid_category where maid_id=$1', [maid_id], (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).json(result.rows);
    })
}

const getMaidCategoryById = (req, res) => {
    const maid_id = parseInt(req.params.maid_id)
    const category_id = parseInt(req.params.category_id)

    pool.query('select * from maid_category where maid_id=$1 and category_id=$2', [maid_id, category_id], (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).json(result.rows);
    })
}

const getMaidCategoryByMaidId = (req, res) => {
    const maid_id = parseInt(req.params.maid_id)

    pool.query('select m.category_id,c.category_name,m.charge,m.maid_id from maid_category m join category c on m.category_id = c.category_id and m.maid_id=$1'
        , [maid_id], (error, result) => {
            if (error) {
                throw error;
            }
            res.status(200).json(result.rows);
        })
}


const updateMaidCategory = (request, response) => {
    const maid_id = parseInt(request.body.maid_id);
    const category_id = parseInt(request.body.category_id);
    const { charge } = request.body;
    pool.query('update maid_category set charge=$1 where maid_id=$2 and category_id=$3',
        [charge, maid_id, category_id],
        (error, result) => {
            if (error) {
                throw error;
            }
            response.status(200).send(`Maid Category updated by id ${maid_id}`);
        })
}

const deleteMaidCategory = (request, response) => {
    const maid_id = parseInt(request.params.maid_id);
    const category_id = parseInt(request.params.category_id);
    pool.query('delete from maid_category where maid_id=$1 and category_id=$2', [maid_id, category_id], (error, result) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`Deleted ${category_id}`);
    });
}

// Feedback
const addFeedback = (req, res) => {
    const { client_id, maid_id, comments, rating } = req.body;
    pool.query('insert into feedback(client_id, maid_id, comments, rating) values ($1,$2,$3,$4)',
        [client_id, maid_id, comments, rating], (error, result) => {
            if (error) {
                throw error;
            }
            res.status(201).send(`Feedback added with id : ${result.feedback_id}`);
        });
}

const getFeedback = (req, res) => {
    pool.query('select * from feedback', (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).json(result.rows);
    })
}

const getFeedbackByMaidId = (req, res) => {
    const maid_id = parseInt(req.params.maid_id);
    pool.query('select c.*,f.* from feedback f,client c where f.client_id = c.client_id and maid_id=$1', [maid_id], (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).json(result.rows);
    })
}

const updateFeedback = (req, res) => {
    const feedback_id = parseInt(req.body.feedback_id);
    const { client_id, maid_id, comments, rating } = req.body;
    pool.query('update feedback set client_id=$1, maid_id=$2, comments=$3, rating=$4 where feedback_id=$5',
        [client_id, maid_id, comments, rating, feedback_id],
        (error, result) => {
            if (error) {
                throw error;
            }
            res.status(200).send(`Feedback updated by id${feedback_id}`);
        })
}

const deleteFeedback = (req, res) => {
    const feedback_id = parseInt(req.params.feedback_id);
    pool.query('delete from feedback where feedback_id=$1', [feedback_id], (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).send(`Feedback Deleted by Id : ${feedback_id}`);
    });
}

const getStatus = (req, res) => {
    pool.query('select * from status', (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).json(result.rows);
    })
}

const upload = (req, res) => {
    if (!req.file) {
        console.log('No file recived');
        return res.send({ success: false });
    }
    else {
        return res.send({
            success: true, name: req.file.filename
        })
    }
}
module.exports = {
    upload,
    addAdmin,
    getAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    getAdminLogin,
    changeAdminPassword,
    forgotAdminPassword,
    addMaid,
    getMaid,
    getMaidById,
    getAllMaidDetail,
    getMaidDetail,
    updateMaid,
    deleteMaid,
    getMaidLogin,
    changeMaidPassword,
    forgotMaidPassword,
    addMaidPhone,
    getMaidPhone,
    updateMaidPhone,
    deleteMaidPhone,
    addLocation,
    getLocation,
    getLocationById,
    getLocationByCity,
    updateLocation,
    deleteLocation,
    addClient,
    getClient,
    getClientById,
    updateClient,
    deleteClient,
    getClientLogin,
    changeClientPassword,
    forgotClientPassword,
    addClientPhone,
    getClientPhone,
    updateClientPhone,
    deleteClientPhone,
    addAddress,
    getAddress,
    getAddressById,
    getAddressByAddressId,
    updateAddress,
    deleteAddress,
    addBooking,
    getBooking,
    getBookingByClientid,
    getBookingByMaidId,
    updateBooking,
    updateBookingStatus,
    deleteBooking,
    addCategory,
    getCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
    addMaidCategory,
    getMaidCategory,
    getMaidCategoryById,
    getMaidCategoryByMaidId,
    updateMaidCategory,
    deleteMaidCategory,
    addFeedback,
    getFeedback,
    getFeedbackByMaidId,
    updateFeedback,
    deleteFeedback,
    getStatus
}