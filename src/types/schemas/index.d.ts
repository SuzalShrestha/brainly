import { InferSchemaType } from 'mongoose';
import { userSchema } from '../../models/user.model';
import { shareSchema } from '../../models/share.model';
import { contentSchema } from '../../models/content.model';

type UserType = InferSchemaType<typeof userSchema>;
type ShareType = InferSchemaType<typeof shareSchema>;
type ContentSchemaType = InferSchemaType<typeof contentSchema>;
