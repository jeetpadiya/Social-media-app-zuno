import notificationModel from '../models/notificationSchema.js';

const getNotifications = async (req, res) => {
    try {
        const recipient = req.user;

        const notifications = await notificationModel.find({ recipient })
            .populate({
                path: 'sender',
                select: 'username avatar'
            })
            .populate({
                path: 'post',
                select: 'text image'
            })
            .sort({ createdAt: -1 })
            .limit(50);

        const unreadCount = await notificationModel.countDocuments({
            recipient,
            read: false
        });

        res.status(200).json({
            success: true,
            notifications: notifications || [],
            unreadCount
        });
    } catch (error) {
        console.error("Get Notifications Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const markAsRead = async (req, res) => {
    try {
        const recipient = req.user;

        await notificationModel.updateMany(
            { recipient, read: false },
            { $set: { read: true } }
        );

        res.status(200).json({
            success: true,
            message: "Notifications marked as read"
        });
    } catch (error) {
        console.error("Mark As Read Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export { getNotifications, markAsRead };
