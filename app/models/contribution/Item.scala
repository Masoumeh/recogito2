package models.contribution

import java.util.UUID
import models.ContentType
import play.api.libs.json._
import play.api.libs.json.Reads._
import play.api.libs.functional.syntax._

case class Item(
  
  itemType: ItemType.Value,
  
  documentId: String,
  
  filepartId: Option[Int],
  
  contentType: ContentType,
  
  annotationId: Option[UUID],
  
  annotationVersionId: Option[UUID]
  
)

object Item {
  
  // JSON representation converts ContentType to an array [ MediaType, ContentType ]
  // so we can use it for analytics more easily. E.g. 'TEXT_PLAIN' -> [ 'TEXT', 'TEXT_PLAIN' ] 
  private def fromCTypeList(list: Seq[String]): ContentType =
    list.flatMap(ContentType.withName(_)).head
    
  private def toCTypeList(ctype: ContentType): Seq[String] =
    Seq(ctype.media, ctype.name)
    
  implicit val itemFormat: Format[Item] = (
    (JsPath \ "item_type").format[ItemType.Value] and
    (JsPath \ "document_id").format[String] and
    (JsPath \ "filepart_id").formatNullable[Int] and
    (JsPath \ "content_type").format[Seq[String]].inmap[ContentType](fromCTypeList, toCTypeList) and
    (JsPath \ "annotation_id").formatNullable[UUID] and
    (JsPath \ "annotation_version_id").formatNullable[UUID]
  )(Item.apply, unlift(Item.unapply))

}
  
object ItemType extends Enumeration {
  
  val DOCUMENT = Value("DOCUMENT")
  
  val COMMENT_BODY = Value("COMMENT_BODY")
  
  val PLACE_BODY = Value("PLACE_BODY")
  
  // TODO PERSON_BODY, EVENT_BODY, FORUM_POST
  
  /** JSON conversion **/
  implicit val itemTypeFormat: Format[ItemType.Value] =
    Format(
      JsPath.read[String].map(ItemType.withName(_)),
      Writes[ItemType.Value](s => JsString(s.toString))
    )
 
}