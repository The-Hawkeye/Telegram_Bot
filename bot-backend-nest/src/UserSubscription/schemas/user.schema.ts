// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  chatId: number;

  @Prop({ required: true })
  username: string;

  @Prop()
  city: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
